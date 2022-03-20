import { HttpModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MailController } from "./mail.controller";
import { MailService } from "./mail.service";

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
