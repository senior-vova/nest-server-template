import { Module } from "@nestjs/common";
import { ModelsModule } from "src/models/models.module";
import { NotificationsService } from "./notification.service";

@Module({
  imports: [ModelsModule],
  controllers: [],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
