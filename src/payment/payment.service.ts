import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
@Injectable()
export class PaymentService {
  private stripe: Stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY,
    {
      apiVersion: '2022-11-15',
    },
  );

  async oneTimeDocumentGenerationPayment() {
    const session =
      await this.stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
          {
            price: 'price_1MAbhsGRCS0CQqRaDjbLLzTc',
            quantity: 1,
          },
        ],
        success_url:
          'http://localhost:3000/payment/success',
        cancel_url: 'http://localhost:3000/payment/cancel',
      });
    return session;
  }
}
