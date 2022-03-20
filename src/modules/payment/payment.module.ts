import { Module } from "@nestjs/common";
import { MailModule } from "src/mail/mail.module";
import { ModelsModule } from "src/models/models.module";
import { NotificationsModule } from "src/notification/notification.module";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { StripeService } from "./services/stripe.service";

@Module({
  imports: [ModelsModule, MailModule, NotificationsModule],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService],
  exports: [PaymentService],
})
export class PaymentModule {}
