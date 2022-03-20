import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ModelsModule } from "../../models/models.module";
import { ConfigModule } from "@nestjs/config";
import { MailModule } from "src/mail/mail.module";
import { JwtModule } from "src/helpers/modules/jwt.module";

@Module({
  imports: [ModelsModule, ConfigModule, MailModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
