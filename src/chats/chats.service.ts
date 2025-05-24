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
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId },
      relations: ['user'],
    });

    if (!user || !service) {
      throw new NotFoundException('Usuario o servicio no encontrado');
    }

    const existingChat = await this.chatRepository.findOne({
      where: {
        user: { id: userId },
        service: { id: serviceId },
        isActive: true,
      },
    });

    if (existingChat) {
      return existingChat;
    }

    const chat = this.chatRepository.create({
      user,
      serviceProvider: service.user,
      service,
      isActive: true,
    });

    return this.chatRepository.save(chat);
  }

  async getChatsByUser(userId: number): Promise<Chat[]> {
    return this.chatRepository.find({
      where: [{ user: { id: userId } }, { serviceProvider: { id: userId } }],
      relations: ['user', 'serviceProvider', 'service', 'messages'],
      order: {
        updatedAt: 'DESC',
      },
    });
  }

  async getChatById(chatId: string): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['user', 'serviceProvider', 'service', 'messages'],
    });

    if (!chat) {
      throw new NotFoundException('Chat no encontrado');
    }

    return chat;
  }

  async getChatMessages(chatId: string): Promise<Message[]> {
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
    chatId: string,
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

  async markMessagesAsRead(chatId: string, userId: number): Promise<void> {
    await this.messageRepository.update(
      {
        chat: { id: chatId },
        sender: { id: Not(userId) },
        isRead: false,
      },
      { isRead: true },
    );
  }
}
