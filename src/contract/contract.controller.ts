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

@Controller('contracts')
export class ContractController {
  constructor(
    private readonly contractService: ContractService,
    private readonly stripeService: StripeService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createContractDto: CreateContractDto) {
    return this.contractService.create(createContractDto);
  }

  @Get('my-contracts')
  @UseGuards(JwtAuthGuard)
  async getMyContracts(@Req() req: Request & { user: User }) {
    return this.contractService.findByUserId(req.user.id);
  }

  @Post('webhook')
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
  findAll() {
    return this.contractService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.contractService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractService.update(+id, updateContractDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.contractService.remove(+id);
  }
}
