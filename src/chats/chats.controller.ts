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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('Chats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new chat',
    description:
      'Creates a new chat between the authenticated user and a service provider',
  })
  @ApiBody({
    type: CreateChatDto,
    description: 'Chat creation data including service ID',
    examples: {
      example1: {
        summary: 'Create chat for service',
        description: 'Start a conversation about a cleaning service',
        value: {
          serviceId: 1,
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Chat created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        createdAt: { type: 'string', example: '2024-01-10T10:00:00Z' },
        updatedAt: { type: 'string', example: '2024-01-10T10:00:00Z' },
        client: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            email: { type: 'string', example: 'john.doe@example.com' },
          },
        },
        provider: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 2 },
            firstName: { type: 'string', example: 'Jane' },
            lastName: { type: 'string', example: 'Smith' },
            email: { type: 'string', example: 'jane.smith@example.com' },
          },
        },
        service: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            title: { type: 'string', example: 'House Cleaning Service' },
            description: {
              type: 'string',
              example: 'Professional house cleaning',
            },
            price: { type: 'number', example: 150.0 },
          },
        },
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              content: {
                type: 'string',
                example: 'Hello! I would like to book your service.',
              },
              createdAt: { type: 'string', example: '2024-01-10T10:00:00Z' },
              sender: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  firstName: { type: 'string', example: 'John' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or chat already exists',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Chat already exists for this service',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Service not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Service not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async create(@Body() createChatDto: CreateChatDto, @Request() req) {
    return this.chatsService.createChat(req.user.id, createChatDto.serviceId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get user chats',
    description: 'Retrieves all chats for the authenticated user',
  })
  @ApiOkResponse({
    description: 'User chats retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          createdAt: { type: 'string', example: '2024-01-10T10:00:00Z' },
          updatedAt: { type: 'string', example: '2024-01-10T10:00:00Z' },
          lastMessage: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 5 },
              content: {
                type: 'string',
                example: "Perfect! I'll see you tomorrow at 9 AM.",
              },
              createdAt: { type: 'string', example: '2024-01-10T15:30:00Z' },
              isRead: { type: 'boolean', example: false },
            },
          },
          unreadCount: { type: 'number', example: 2 },
          service: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              title: { type: 'string', example: 'House Cleaning Service' },
              price: { type: 'number', example: 150.0 },
              images: {
                type: 'array',
                items: {
                  type: 'string',
                  example: 'https://example.com/image1.jpg',
                },
              },
            },
          },
          otherUser: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 2 },
              firstName: { type: 'string', example: 'Jane' },
              lastName: { type: 'string', example: 'Smith' },
              profileImage: {
                type: 'string',
                example: 'https://example.com/profile.jpg',
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  async findAll(@Request() req) {
    return this.chatsService.getChatsByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get chat by ID',
    description: 'Retrieves a specific chat by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Chat ID',
    type: 'number',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Chat retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        createdAt: { type: 'string', example: '2024-01-10T10:00:00Z' },
        updatedAt: { type: 'string', example: '2024-01-10T15:30:00Z' },
        client: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            email: { type: 'string', example: 'john.doe@example.com' },
            profileImage: {
              type: 'string',
              example: 'https://example.com/john.jpg',
            },
          },
        },
        provider: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 2 },
            firstName: { type: 'string', example: 'Jane' },
            lastName: { type: 'string', example: 'Smith' },
            email: { type: 'string', example: 'jane.smith@example.com' },
            profileImage: {
              type: 'string',
              example: 'https://example.com/jane.jpg',
            },
          },
        },
        service: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            title: { type: 'string', example: 'House Cleaning Service' },
            description: {
              type: 'string',
              example: 'Professional house cleaning service',
            },
            price: { type: 'number', example: 150.0 },
            images: {
              type: 'array',
              items: {
                type: 'string',
                example: 'https://example.com/image1.jpg',
              },
            },
          },
        },
        messagesCount: { type: 'number', example: 5 },
        lastMessageAt: { type: 'string', example: '2024-01-10T15:30:00Z' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Chat not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Chat not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async findOne(@Param('id') id: number) {
    return this.chatsService.getChatById(id);
  }

  @Get(':id/messages')
  @ApiOperation({
    summary: 'Get chat messages',
    description: 'Retrieves all messages for a specific chat',
  })
  @ApiParam({
    name: 'id',
    description: 'Chat ID',
    type: 'number',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Chat messages retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          content: {
            type: 'string',
            example: 'Hello! I would like to book your service.',
          },
          createdAt: { type: 'string', example: '2024-01-10T10:00:00Z' },
          updatedAt: { type: 'string', example: '2024-01-10T10:00:00Z' },
          isRead: { type: 'boolean', example: true },
          sender: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              firstName: { type: 'string', example: 'John' },
              lastName: { type: 'string', example: 'Doe' },
              profileImage: {
                type: 'string',
                example: 'https://example.com/john.jpg',
              },
            },
          },
          receiver: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 2 },
              firstName: { type: 'string', example: 'Jane' },
              lastName: { type: 'string', example: 'Smith' },
              profileImage: {
                type: 'string',
                example: 'https://example.com/jane.jpg',
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Chat not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Chat not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async getMessages(@Param('id') id: number) {
    return this.chatsService.getChatMessages(id);
  }

  @Get('unread/count')
  @ApiOperation({
    summary: 'Get unread messages count',
    description:
      'Retrieves the count of unread messages for the authenticated user',
  })
  @ApiOkResponse({
    description: 'Unread messages count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        unreadCount: {
          type: 'number',
          description: 'Number of unread messages',
          example: 5,
        },
        chatsWithUnread: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              chatId: { type: 'number', example: 1 },
              unreadCount: { type: 'number', example: 2 },
              lastMessage: {
                type: 'string',
                example: "Perfect! I'll see you tomorrow.",
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  async getUnreadMessagesCount(@Request() req) {
    return this.chatsService.getUnreadMessagesCount(req.user.id);
  }

  @Post(':id/messages')
  @ApiOperation({
    summary: 'Send message',
    description: 'Sends a new message in a specific chat',
  })
  @ApiParam({
    name: 'id',
    description: 'Chat ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'Message content',
          example: 'Hello! I would like to book your service.',
        },
      },
      required: ['content'],
    },
    examples: {
      example1: {
        summary: 'Simple message',
        description: 'Send a basic text message',
        value: {
          content: 'Hello! I would like to book your service.',
        },
      },
      example2: {
        summary: 'Question about service',
        description: 'Ask about service details',
        value: {
          content: 'What time are you available tomorrow?',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Message sent successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 6 },
        content: {
          type: 'string',
          example: 'Hello! I would like to book your service.',
        },
        createdAt: { type: 'string', example: '2024-01-10T16:00:00Z' },
        updatedAt: { type: 'string', example: '2024-01-10T16:00:00Z' },
        isRead: { type: 'boolean', example: false },
        sender: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            profileImage: {
              type: 'string',
              example: 'https://example.com/john.jpg',
            },
          },
        },
        receiver: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 2 },
            firstName: { type: 'string', example: 'Jane' },
            lastName: { type: 'string', example: 'Smith' },
            profileImage: {
              type: 'string',
              example: 'https://example.com/jane.jpg',
            },
          },
        },
        chat: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            updatedAt: { type: 'string', example: '2024-01-10T16:00:00Z' },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Message content cannot be empty' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Chat not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Chat not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async sendMessage(
    @Param('id') id: number,
    @Body('content') content: string,
    @Request() req,
  ) {
    return this.chatsService.createMessage(id, content, req.user.id);
  }
}
