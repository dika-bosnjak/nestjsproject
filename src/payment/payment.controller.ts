import {
  Controller,
  Get,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('one-time-payment')
  async oneTimePayment(@Req() req, @Res() res) {
    const documentId = req.body.docId;
    console.log('documentId', documentId);
    const session =
      await this.paymentService.oneTimeDocumentGenerationPayment(
        documentId,
      );

    return res.send(session.url);
  }

  @Get('success')
  async success(@Res() res, @Req() req) {
    try {
      const paidStatus =
        await this.paymentService.checkSessionStatus(
          req.query.session_id,
        );
      if (paidStatus) {
        res.status(200);
        return res.send('Payment successful');
      }
    } catch (error) {
      return res.send('An error in your payment occurred.');
    }
  }

  @Get('cancel')
  async cancel(@Res() res) {
    return res.send('Cancel');
  }
}
