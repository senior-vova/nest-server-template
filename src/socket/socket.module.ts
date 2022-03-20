import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "src/helpers/modules/jwt.module";
import { ModelsModule } from "src/models/models.module";
import { NotificationsModule } from "src/notification/notification.module";
import { NotificationsEventsGateway } from "./notifications.gateway";

@Module({
  imports: [ModelsModule, ConfigModule, NotificationsModule, JwtModule],
  providers: [NotificationsEventsGateway],
})
export class SocketModule {}
