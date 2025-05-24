import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '../auth/guards/ws-jwt-auth.guard';
import { ChatsService } from './chats.service';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatsService: ChatsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = this.extractTokenFromHeader(client);

      if (!token) {
        throw new WsException('No token provided');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // Agregar el usuario al objeto del cliente para uso posterior
      client['user'] = payload;
    } catch (error) {
      client.disconnect();
    }
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    const token = client.handshake.auth?.token; // Preferente
    if (token) return token;

    // Fallback: header Authorization (solo funciona en long polling)
    const [type, headerToken] =
      client.handshake.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? headerToken : undefined;
  }

  handleDisconnect() {}

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('joinChat')
  async handleJoinChat(client: Socket, chatId: string) {
    client.join(`chat:${chatId}`);
    return { event: 'joinChat', data: { chatId } };
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('leaveChat')
  async handleLeaveChat(client: Socket, chatId: string) {
    client.leave(`chat:${chatId}`);
    return { event: 'leaveChat', data: { chatId } };
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: { chatId: string; content: string },
  ) {
    const message = await this.chatsService.createMessage(
      payload.chatId,
      payload.content,
      client['user'].sub,
    );

    this.server.to(`chat:${payload.chatId}`).emit('newMessage', message);
    return { event: 'sendMessage', data: message };
  }
}
