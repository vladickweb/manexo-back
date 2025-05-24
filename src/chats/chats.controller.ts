import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  async create(@Body() createChatDto: CreateChatDto, @Request() req) {
    return this.chatsService.createChat(req.user.sub, createChatDto.serviceId);
  }

  @Get()
  async findAll(@Request() req) {
    return this.chatsService.getChatsByUser(req.user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.chatsService.getChatById(id);
  }

  @Get(':id/messages')
  async getMessages(@Param('id') id: string) {
    return this.chatsService.getChatMessages(id);
  }

  @Post(':id/messages')
  async sendMessage(
    @Param('id') id: string,
    @Body('content') content: string,
    @Request() req,
  ) {
    return this.chatsService.createMessage(id, content, req.user.sub);
  }
}
