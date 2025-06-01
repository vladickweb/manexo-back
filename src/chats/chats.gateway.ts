import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  UseGuards,
  UsePipes,
  ValidationPipe,
  Logger,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { WsJwtAuthGuard } from '../auth/guards/ws-jwt-auth.guard';
import { ChatsService } from './chats.service';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { CreateMessageDto } from './dto/message.dto';
import { NotificationType } from '../notifications/entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Notification } from '../notifications/entities/notification.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['authorization', 'content-type'],
  },
  namespace: 'chat',
  transports: ['websocket'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
  allowUpgrades: false,
  perMessageDeflate: false,
  maxHttpBufferSize: 1e8,
  path: '/socket.io/',
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatsGateway.name);
  private connectedClients: Map<string, Socket> = new Map();
  private userSockets: Map<number, Set<string>> = new Map();
  private readonly RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_DELAY = 1000;

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatsService: ChatsService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async handleConnection(client: Socket) {
    this.logger.debug(`✅ Usuario ${client.id} autenticado correctamente`);

    try {
      this.logger.debug('🔌 Nueva conexión WebSocket recibida');
      this.logger.debug('🔑 Intentando autenticar conexión...');

      const token = client.handshake.auth.token;
      if (!token) {
        this.logger.error('❌ Token no proporcionado');
        client.emit('error', { message: 'Token no proporcionado' });
        client.disconnect();
        return;
      }

      let payload;
      try {
        payload = this.jwtService.verify(token);
      } catch (error) {
        this.logger.error(`❌ Token inválido: ${error.message}`);
        client.emit('error', { message: 'Token inválido' });
        client.disconnect();
        return;
      }

      client['user'] = payload;
      const userId = payload.sub;

      // Desconectar conexiones anteriores del mismo usuario
      if (this.userSockets.has(userId)) {
        const existingSockets = this.userSockets.get(userId);
        for (const socketId of existingSockets) {
          const existingSocket = this.connectedClients.get(socketId);
          if (existingSocket && existingSocket.id !== client.id) {
            this.logger.debug(
              `Desconectando socket anterior ${socketId} para usuario ${userId}`,
            );
            existingSocket.emit('disconnected', { reason: 'new_connection' });
            existingSocket.disconnect();
          }
        }
        this.userSockets.delete(userId);
      }

      // Unir al usuario a su sala personal
      const userRoom = `user:${userId}`;
      client.join(userRoom);
      this.logger.debug(`✅ Usuario ${userId} unido a sala ${userRoom}`);

      // Guardar la conexión
      this.connectedClients.set(client.id, client);
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId).add(client.id);

      this.logger.debug(`✅ Usuario ${userId} autenticado correctamente`);
      this.logger.debug(`🔌 Usuario ${userId} conectado al WebSocket de chat`);

      try {
        // Obtener todos los chats del usuario y unirse a sus salas
        const userChats = await this.chatsService.findByUserId(userId);
        for (const chat of userChats) {
          const roomName = `chat:${chat.id}`;
          client.join(roomName);
          this.logger.debug(
            `Usuario ${userId} unido automáticamente a sala ${roomName}`,
          );
        }

        // Enviar últimos mensajes y notificaciones al usuario
        await this.sendLastMessagesToUser(userId);
        await this.sendUnreadNotifications(userId);
      } catch (error) {
        this.logger.error(`Error al enviar datos iniciales: ${error.message}`);
        client.emit('error', {
          message: 'Error al cargar datos iniciales',
          code: 'LOAD_INITIAL_DATA_ERROR',
        });
      }

      // Enviar evento de conexión exitosa
      client.emit('connected', {
        userId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error(`❌ Error de autenticación: ${error.message}`);
      client.emit('error', {
        message: 'Error de autenticación',
        code: 'AUTH_ERROR',
      });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client['user']?.sub;
    if (userId) {
      this.logger.debug(
        `🔌 Usuario ${userId} desconectado del WebSocket de chat`,
      );
      this.connectedClients.delete(client.id);
      if (this.userSockets.has(userId)) {
        this.userSockets.get(userId).delete(client.id);
        if (this.userSockets.get(userId).size === 0) {
          this.userSockets.delete(userId);
        }
      }

      // Notificar a otros clientes del mismo usuario
      const remainingSockets = this.userSockets.get(userId);
      if (remainingSockets && remainingSockets.size > 0) {
        for (const socketId of remainingSockets) {
          const socket = this.connectedClients.get(socketId);
          if (socket) {
            socket.emit('disconnected', {
              reason: 'client_disconnect',
              timestamp: new Date().toISOString(),
            });
          }
        }
      }
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('reconnect')
  async handleReconnect(client: Socket) {
    try {
      const userId = client['user'].sub;
      this.logger.debug(`Usuario ${userId} solicitando reconexión`);

      // Enviar últimos mensajes y notificaciones al usuario
      await this.sendLastMessagesToUser(userId);
      await this.sendUnreadNotifications(userId);

      client.emit('reconnected', {
        userId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error(`Error en reconexión: ${error.message}`);
      client.emit('error', {
        message: 'Error en reconexión',
        code: 'RECONNECT_ERROR',
      });
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('joinChat')
  async handleJoinChat(client: Socket, chatId: string) {
    try {
      if (!chatId) {
        throw new WsException('ID del chat no proporcionado');
      }

      const chat = await this.chatsService.findOne(chatId);
      if (!chat) {
        throw new NotFoundException('Chat no encontrado');
      }

      if (
        chat.user.id !== client['user'].sub &&
        chat.serviceProvider.id !== client['user'].sub
      ) {
        throw new UnauthorizedException('No tienes acceso a este chat');
      }

      const roomName = `chat:${chatId}`;
      client.join(roomName);
      this.logger.debug(
        `Usuario ${client['user'].sub} se unió a la sala ${roomName}. Socket ID: ${client.id}`,
      );

      // Verificar las salas a las que está unido el socket
      const rooms = Array.from(client.rooms);
      this.logger.debug(
        `Salas actuales del socket ${client.id}: ${rooms.join(', ')}`,
      );
    } catch (error) {
      this.logger.error(`Error al unirse al chat: ${error.message}`);
      throw new WsException(error.message);
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('leaveChat')
  async handleLeaveChat(client: Socket, chatId: string) {
    try {
      if (!chatId) {
        throw new WsException('ID del chat no proporcionado');
      }

      client.leave(`chat:${chatId}`);
      this.logger.log(`Usuario ${client['user'].sub} salió del chat ${chatId}`);
    } catch (error) {
      this.logger.error(`Error al salir del chat: ${error.message}`);
      throw new WsException(error.message);
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('getLastReadMessage')
  async handleGetLastReadMessage(client: Socket, chatId: string) {
    try {
      if (!chatId) {
        throw new WsException('ID del chat no proporcionado');
      }

      const userId = client['user'].sub;
      const lastRead = await this.chatsService.getLastReadMessage(
        chatId,
        userId,
      );
      client.emit('lastReadMessage', lastRead);
    } catch (error) {
      this.logger.error(
        `Error al obtener último mensaje leído: ${error.message}`,
      );
      throw new WsException(error.message);
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: CreateMessageDto) {
    try {
      const chat = await this.chatsService.findOne(payload.chatId);
      if (!chat) {
        throw new NotFoundException('Chat no encontrado');
      }

      if (
        chat.user.id !== client['user'].sub &&
        chat.serviceProvider.id !== client['user'].sub
      ) {
        throw new UnauthorizedException('No tienes acceso a este chat');
      }

      const message = await this.chatsService.createMessage(
        payload.chatId,
        payload.content,
        client['user'].sub,
      );

      const recipientId =
        chat.user.id === client['user'].sub
          ? chat.serviceProvider.id
          : chat.user.id;

      // Obtener información del remitente
      const sender = await this.userRepository.findOne({
        where: { id: client['user'].sub },
        select: ['firstName', 'lastName', 'id'],
      });

      // Crear la notificación
      const notification = await this.createNotification({
        userId: recipientId,
        type: NotificationType.NEW_MESSAGE,
        title: 'Nuevo mensaje',
        content: `${sender.firstName} ${sender.lastName}: ${payload.content.substring(0, 50)}${payload.content.length > 50 ? '...' : ''}`,
        data: {
          chatId: payload.chatId,
          messageId: message.id,
          senderId: client['user'].sub,
          senderName: `${sender.firstName} ${sender.lastName}`,
          preview: payload.content.substring(0, 50),
        },
      });

      // Emitir la notificación al usuario destinatario
      this.server.to(`user:${recipientId}`).emit('notification', notification);

      // Emitir el nuevo mensaje a todos los usuarios en el chat
      const roomName = `chat:${payload.chatId}`;
      this.logger.debug(
        `Emitiendo mensaje a la sala ${roomName}. Mensaje: ${JSON.stringify(message)}`,
      );

      // Verificar los sockets en la sala
      const sockets = await this.server.in(roomName).fetchSockets();
      this.logger.debug(
        `Sockets en la sala ${roomName}: ${sockets.map((s) => s.id).join(', ')}`,
      );

      this.server.to(roomName).emit('newMessage', {
        ...message,
        sender: {
          id: sender.id,
          firstName: sender.firstName,
          lastName: sender.lastName,
        },
      });

      // Emitir el último mensaje actualizado
      const lastMessagePayload = {
        chatId: payload.chatId,
        message: {
          id: message.id,
          content: message.content,
          createdAt: message.createdAt,
          senderId: message.sender.id,
          isRead: message.isRead,
          sender: {
            id: sender.id,
            firstName: sender.firstName,
            lastName: sender.lastName,
          },
        },
      };

      // Emitir a ambos usuarios del chat
      this.server
        .to(`user:${chat.user.id}`)
        .emit('lastMessageUpdate', lastMessagePayload);
      this.server
        .to(`user:${chat.serviceProvider.id}`)
        .emit('lastMessageUpdate', lastMessagePayload);

      this.logger.debug(`Mensaje enviado en el chat ${payload.chatId}`);

      return { event: 'message', data: message };
    } catch (error) {
      this.logger.error(`Error al enviar mensaje: ${error.message}`);
      throw new WsException(error.message);
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('markMessagesAsRead')
  async handleMarkMessagesAsRead(client: Socket, chatId: string) {
    try {
      if (!chatId) {
        throw new WsException('ID del chat no proporcionado');
      }

      const userId = client['user'].sub;
      this.logger.debug(
        `Usuario ${userId} intentando marcar mensajes como leídos en chat ${chatId}`,
      );

      const chat = await this.chatsService.findOne(chatId);
      if (!chat) {
        throw new NotFoundException('Chat no encontrado');
      }

      if (chat.user.id !== userId && chat.serviceProvider.id !== userId) {
        throw new UnauthorizedException('No tienes acceso a este chat');
      }

      await this.chatsService.markMessagesAsRead(chatId, userId);
      this.logger.debug(`Mensajes marcados como leídos en chat ${chatId}`);

      // Eliminar todas las notificaciones no leídas relacionadas con este chat
      await this.deleteNotificationsByTypeAndData(
        NotificationType.NEW_MESSAGE,
        {
          chatId,
        },
      );

      this.server.to(`chat:${chatId}`).emit('messagesRead', {
        chatId,
        userId,
      });

      this.logger.log(`Mensajes marcados como leídos en el chat ${chatId}`);
      return { event: 'markMessagesAsRead', data: { chatId } };
    } catch (error) {
      this.logger.error(
        `Error al marcar mensajes como leídos: ${error.message}`,
      );
      throw new WsException(error.message);
    }
  }

  // Métodos de notificaciones
  private async createNotification(notification: {
    userId: number;
    type: NotificationType;
    title: string;
    content: string;
    data?: any;
  }) {
    this.logger.debug(
      `Creando notificación para usuario ${notification.userId}:`,
      notification,
    );

    const newNotification = this.notificationRepository.create({
      user: { id: notification.userId },
      type: notification.type,
      title: notification.title,
      message: notification.content,
      data: notification.data ? JSON.stringify(notification.data) : null,
    });

    const savedNotification =
      await this.notificationRepository.save(newNotification);
    this.logger.debug(
      `Notificación creada con ID ${savedNotification.id}:`,
      savedNotification,
    );

    return savedNotification;
  }

  private async sendUnreadNotifications(userId: number) {
    const notifications = await this.notificationRepository.find({
      where: {
        user: { id: userId },
        isRead: false,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (notifications.length > 0) {
      this.server.to(`user:${userId}`).emit('notifications', notifications);
    }
  }

  private async deleteNotificationsByTypeAndData(
    type: NotificationType,
    data: any,
  ) {
    if (!data || !data.chatId) {
      this.logger.warn('No se proporcionó chatId para eliminar notificaciones');
      return;
    }

    try {
      const result = await this.notificationRepository
        .createQueryBuilder()
        .delete()
        .from(Notification)
        .where('type = :type', { type })
        .andWhere('data::text LIKE :chatIdPattern', {
          chatIdPattern: `%"chatId":"${data.chatId}"%`,
        })
        .execute();

      this.logger.debug(`Notificaciones eliminadas: ${result.affected}`);
    } catch (error) {
      this.logger.error(
        `Error al eliminar notificaciones: ${error.message}`,
        error.stack,
      );
    }
  }

  private async sendLastMessagesToUser(userId: number) {
    try {
      this.logger.debug(`Buscando chats para usuario ${userId}`);
      const userChats = await this.chatsService.findByUserId(userId);
      this.logger.debug(
        `Encontrados ${userChats.length} chats para usuario ${userId}`,
      );

      const lastMessages = [];

      for (const chat of userChats) {
        this.logger.debug(`Buscando último mensaje para chat ${chat.id}`);
        const lastMessage = await this.chatsService.getLastMessage(chat.id);

        if (lastMessage) {
          const messagePayload = {
            chatId: chat.id,
            message: {
              id: lastMessage.id,
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
              senderId: lastMessage.sender?.id,
              isRead: lastMessage.isRead,
              sender: lastMessage.sender
                ? {
                    id: lastMessage.sender.id,
                    firstName: lastMessage.sender.firstName,
                    lastName: lastMessage.sender.lastName,
                    profileImageUrl: lastMessage.sender.profileImageUrl,
                  }
                : null,
            },
          };

          lastMessages.push(messagePayload);
        }
      }

      if (lastMessages.length > 0) {
        // Emitir cada mensaje individualmente
        for (const message of lastMessages) {
          this.server.to(`user:${userId}`).emit('lastMessageUpdate', message);

          // También emitir el evento lastMessages para compatibilidad
          this.server.to(`user:${userId}`).emit('lastMessages', [message]);
        }
      }
    } catch (error) {
      this.logger.error(
        `Error al enviar últimos mensajes al usuario ${userId}: ${error.message}`,
        error.stack,
      );
    }
  }
}
