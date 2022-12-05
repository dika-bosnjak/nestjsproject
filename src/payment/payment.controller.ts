import { Controller, Get, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get('one-time-payment')
  async oneTimePayment(@Res() res) {
    const session =
      await this.paymentService.oneTimeDocumentGenerationPayment();

    return res.redirect(303, session.url);
  }

  @Get('success')
  async success(@Res() res) {
    return res.send('Success');
  }

  @Get('cancel')
  async cancel(@Res() res) {
    return res.send('Cancel');
  }
}
