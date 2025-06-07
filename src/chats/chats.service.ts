import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { Message } from '../messages/entities/message.entity';
import { User } from '../user/entities/user.entity';
import { Service } from '../service/entities/service.entity';
import { Not } from 'typeorm';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async createChat(userId: number, serviceId: number): Promise<Chat> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const service = await this.serviceRepository.findOne({
      where: { id: serviceId },
      relations: ['user', 'subcategory', 'subcategory.category'],
    });
    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    const existingChat = await this.chatRepository.findOne({
      where: {
        user: { id: userId },
        service: { id: serviceId },
      },
    });

    if (existingChat) {
      return existingChat;
    }

    const chat = this.chatRepository.create({
      user,
      serviceProvider: service.user,
      service,
    });

    const savedChat = await this.chatRepository.save(chat);

    const initialMessage = this.messageRepository.create({
      content: `Chat iniciado sobre el servicio: ${service.description}\nCategoría: ${service.subcategory.category.name}\nSubcategoría: ${service.subcategory.name}\nPrecio: ${service.price}€`,
      sender: service.user,
      chat: savedChat,
      isRead: false,
      isSystemMessage: true,
    });

    await this.messageRepository.save(initialMessage);

    return savedChat;
  }

  async getChatsByUser(userId: number): Promise<Chat[]> {
    if (!userId) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.chatRepository.find({
      where: [{ user: { id: userId } }, { serviceProvider: { id: userId } }],
      relations: [
        'user',
        'serviceProvider',
        'service',
        'messages',
        'messages.sender',
      ],
      order: {
        updatedAt: 'DESC',
      },
    });
  }

  async getChatById(chatId: number): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: [
        'user',
        'serviceProvider',
        'service',
        'messages',
        'messages.sender',
      ],
    });

    if (!chat) {
      throw new NotFoundException('Chat no encontrado');
    }

    return chat;
  }

  async getChatMessages(chatId: number): Promise<Message[]> {
    await this.getChatById(chatId);

    return this.messageRepository.find({
      where: { chat: { id: chatId } },
      relations: ['sender'],
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async createMessage(
    chatId: number,
    content: string,
    senderId: number,
  ): Promise<Message> {
    const chat = await this.getChatById(chatId);
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });

    if (!sender) {
      throw new NotFoundException('Remitente no encontrado');
    }

    const message = this.messageRepository.create({
      content,
      chat,
      sender,
      isRead: false,
    });

    return this.messageRepository.save(message);
  }

  async markMessagesAsRead(chatId: number, userId: number): Promise<void> {
    const chat = await this.chatRepository.findOne({
      where: [
        { id: chatId, user: { id: userId } },
        { id: chatId, serviceProvider: { id: userId } },
      ],
    });

    if (!chat) {
      throw new NotFoundException('Chat no encontrado o usuario no autorizado');
    }

    await this.messageRepository.update(
      {
        chat: { id: chatId },
        sender: { id: Not(userId) },
        isRead: false,
      },
      { isRead: true },
    );
  }

  async getUnreadMessagesCount(
    userId: number,
  ): Promise<{ chatId: number; count: number }[]> {
    const chats = await this.chatRepository.find({
      where: [{ user: { id: userId } }, { serviceProvider: { id: userId } }],
      relations: ['messages', 'messages.sender'],
    });

    return chats.map((chat) => ({
      chatId: chat.id,
      count: chat.messages.filter(
        (message) => !message.isRead && message.sender.id !== userId,
      ).length,
    }));
  }

  async findOne(id: number): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { id },
      relations: ['user', 'serviceProvider', 'service'],
    });

    if (!chat) {
      throw new NotFoundException('Chat no encontrado');
    }

    return chat;
  }

  async getLastReadMessage(
    chatId: number,
    userId: number,
  ): Promise<Message | null> {
    return await this.messageRepository.findOne({
      where: {
        chat: { id: chatId },
        sender: { id: Not(userId) },
        isRead: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserId(userId: number) {
    return this.chatRepository.find({
      where: [{ user: { id: userId } }, { serviceProvider: { id: userId } }],
      relations: ['user', 'serviceProvider', 'messages', 'messages.sender'],
      order: {
        updatedAt: 'DESC',
      },
    });
  }

  async getLastMessage(chatId: number) {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['messages', 'messages.sender'],
      order: {
        messages: {
          createdAt: 'DESC',
        },
      },
    });

    if (!chat?.messages?.length) {
      return null;
    }

    return chat.messages[0];
  }
}
