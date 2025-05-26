import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get('config.stripe.secretKey'),
      {
        apiVersion: '2025-04-30.basil',
      },
    );
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'eur',
  ): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency,
    });
  }

  async confirmPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.confirm(paymentIntentId);
  }

  async retrievePaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  async createPaymentLink(
    amount: number,
    contractId: string,
    customerEmail: string,
    serviceName: string,
  ): Promise<Stripe.PaymentLink> {
    // Primero creamos el producto
    const product = await this.stripe.products.create({
      name: serviceName,
    });

    // Luego creamos el precio
    const price = await this.stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(amount * 100), // Stripe usa centavos
      currency: 'eur',
    });

    // Finalmente creamos el Payment Link
    return await this.stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      customer_creation: 'always',
      after_completion: {
        type: 'redirect',
        redirect: {
          url: `${this.configService.get('FRONTEND_URL')}/contracts/${contractId}/success`,
        },
      },
      metadata: {
        contractId,
        customerEmail,
      },
    });
  }

  async handleWebhookEvent(payload: Buffer, signature: string) {
    const webhookSecret = this.configService.get('config.stripe.webhookSecret');

    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET no está configurado');
    }

    try {
      if (process.env.NODE_ENV === 'development' && !signature) {
        return JSON.parse(payload.toString());
      }

      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );

      return event;
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }
  }
}
