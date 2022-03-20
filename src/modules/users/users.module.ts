import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ModelsModule } from "src/models/models.module";
import { NotificationsModule } from "src/notification/notification.module";
import { UserController } from "./users.controller";
import { UserService } from "./users.service";

@Module({
  imports: [ModelsModule, ConfigModule, NotificationsModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
