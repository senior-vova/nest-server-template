import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ModelsModule } from "src/models/models.module";
import { NotificationsModule } from "src/notification/notification.module";
import { SchedulerService } from "./scheduler.service";

@Module({
  imports: [ScheduleModule.forRoot(), ModelsModule, NotificationsModule],
  controllers: [],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
