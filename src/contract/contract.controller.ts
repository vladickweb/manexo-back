import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StripeService } from '../stripe/stripe.service';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiHeader,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('Contracts')
@ApiBearerAuth()
@Controller('contracts')
export class ContractController {
  constructor(
    private readonly contractService: ContractService,
    private readonly stripeService: StripeService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create new contract',
    description:
      'Creates a new contract between a client and a service provider',
  })
  @ApiBody({
    type: CreateContractDto,
    description:
      'Contract creation data including service, client, provider, and time slots',
    examples: {
      example1: {
        summary: 'Basic contract creation',
        description: 'Create a contract for a cleaning service',
        value: {
          serviceId: 1,
          clientId: 2,
          providerId: 3,
          amount: 150.0,
          clientEmail: 'client@example.com',
          serviceName: 'House Cleaning Service',
          timeSlots: [
            {
              date: '2024-01-15',
              startTime: '09:00',
              endTime: '12:00',
            },
          ],
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Contract created successfully with payment link',
    schema: {
      type: 'object',
      properties: {
        contract: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            amount: { type: 'number', example: 150.0 },
            status: { type: 'string', example: 'PENDING' },
            createdAt: { type: 'string', example: '2024-01-10T10:00:00Z' },
          },
        },
        bookings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              date: { type: 'string', example: '2024-01-15' },
              startTime: { type: 'string', example: '09:00' },
              endTime: { type: 'string', example: '12:00' },
              status: { type: 'string', example: 'PENDING' },
            },
          },
        },
        paymentUrl: {
          type: 'string',
          description: 'Stripe payment link URL',
          example:
            'https://checkout.stripe.com/pay/cs_test_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0u1V2w3X4y5Z6',
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
    description: 'Invalid input data or service not available',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Service not available for requested time slots',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Service, client, or provider not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Service not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  create(@Body() createContractDto: CreateContractDto) {
    return this.contractService.create(createContractDto);
  }

  @Get('my-contracts')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get user contracts',
    description:
      'Retrieves all contracts where the authenticated user is either client or provider',
  })
  @ApiOkResponse({
    description: 'User contracts retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        clientContracts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              amount: { type: 'number', example: 150.0 },
              status: { type: 'string', example: 'PAID' },
              timeSlots: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    date: { type: 'string', example: '2024-01-15' },
                    startTime: { type: 'string', example: '09:00' },
                    endTime: { type: 'string', example: '12:00' },
                    status: { type: 'string', example: 'CONFIRMED' },
                  },
                },
              },
              canReview: { type: 'boolean', example: true },
            },
          },
          description: 'Contracts where user is the client',
        },
        providerContracts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 2 },
              amount: { type: 'number', example: 200.0 },
              status: { type: 'string', example: 'PAID' },
              timeSlots: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    date: { type: 'string', example: '2024-01-16' },
                    startTime: { type: 'string', example: '14:00' },
                    endTime: { type: 'string', example: '17:00' },
                    status: { type: 'string', example: 'CONFIRMED' },
                  },
                },
              },
              canReview: { type: 'boolean', example: false },
            },
          },
          description: 'Contracts where user is the provider',
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
  async getMyContracts(@Req() req: Request & { user: User }) {
    return this.contractService.findByUserId(req.user.id);
  }

  @Post('webhook')
  @ApiOperation({
    summary: 'Stripe webhook handler',
    description: 'Handles Stripe webhook events for payment processing',
  })
  @ApiHeader({
    name: 'stripe-signature',
    description: 'Stripe webhook signature for verification',
    required: true,
  })
  @ApiOkResponse({
    description: 'Webhook processed successfully',
    schema: {
      type: 'object',
      properties: {
        received: { type: 'boolean', example: true },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid webhook payload or signature',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Invalid webhook signature' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    if (!request.rawBody) {
      throw new Error('No webhook payload was provided');
    }

    try {
      const event = await this.stripeService.handleWebhookEvent(
        request.rawBody,
        signature,
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const contractId = session.metadata.contractId;
        await this.contractService.handlePaymentSuccess(contractId);
      }

      return { received: true };
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all contracts',
    description: 'Retrieves all contracts in the system (admin only)',
  })
  @ApiOkResponse({
    description: 'All contracts retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          amount: { type: 'number', example: 150.0 },
          status: { type: 'string', example: 'PAID' },
          createdAt: { type: 'string', example: '2024-01-10T10:00:00Z' },
          service: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              title: { type: 'string', example: 'House Cleaning Service' },
            },
          },
          client: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 2 },
              firstName: { type: 'string', example: 'John' },
              lastName: { type: 'string', example: 'Doe' },
            },
          },
          provider: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 3 },
              firstName: { type: 'string', example: 'Jane' },
              lastName: { type: 'string', example: 'Smith' },
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
  findAll() {
    return this.contractService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get contract by ID',
    description: 'Retrieves a specific contract by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Contract ID',
    type: 'number',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Contract retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        amount: { type: 'number', example: 150.0 },
        agreedPrice: { type: 'number', example: 150.0 },
        status: { type: 'string', example: 'PAID' },
        createdAt: { type: 'string', example: '2024-01-10T10:00:00Z' },
        updatedAt: { type: 'string', example: '2024-01-10T10:00:00Z' },
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
          },
        },
        client: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 2 },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            email: { type: 'string', example: 'john.doe@example.com' },
          },
        },
        provider: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 3 },
            firstName: { type: 'string', example: 'Jane' },
            lastName: { type: 'string', example: 'Smith' },
            email: { type: 'string', example: 'jane.smith@example.com' },
          },
        },
        bookings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              date: { type: 'string', example: '2024-01-15' },
              startTime: { type: 'string', example: '09:00' },
              endTime: { type: 'string', example: '12:00' },
              status: { type: 'string', example: 'CONFIRMED' },
              totalPrice: { type: 'number', example: 150.0 },
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
    description: 'Contract not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Contract not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  findOne(@Param('id') id: number) {
    return this.contractService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update contract',
    description: 'Updates an existing contract with new information',
  })
  @ApiParam({
    name: 'id',
    description: 'Contract ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    type: UpdateContractDto,
    description: 'Contract update data',
    examples: {
      example1: {
        summary: 'Update contract status',
        description: 'Update contract status to PAID',
        value: {
          status: 'PAID',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Contract updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        amount: { type: 'number', example: 150.0 },
        status: { type: 'string', example: 'PAID' },
        updatedAt: { type: 'string', example: '2024-01-10T10:00:00Z' },
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
    description: 'Contract not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Contract not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  update(
    @Param('id') id: number,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractService.update(+id, updateContractDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete contract',
    description: 'Permanently deletes a contract from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'Contract ID',
    type: 'number',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Contract deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Contract deleted successfully' },
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
    description: 'Contract not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Contract not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  remove(@Param('id') id: number) {
    return this.contractService.remove(+id);
  }
}
