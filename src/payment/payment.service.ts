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

  async oneTimeDocumentGenerationPayment(docId) {
    try {
      const session =
        await this.stripe.checkout.sessions.create({
          mode: 'payment',
          line_items: [
            {
              price: 'price_1MAbhsGRCS0CQqRaDjbLLzTc',
              quantity: 1,
            },
          ],
          success_url: `http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}&docId=${docId}`,
          cancel_url:
            'http://localhost:3000/payment/cancel',
        });

      return session;
    } catch (error) {
      return error;
    }
  }

  async checkSessionStatus(sessionId: string) {
    try {
      const session =
        await this.stripe.checkout.sessions.retrieve(
          sessionId,
        );
      if (session.payment_status === 'paid') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}
