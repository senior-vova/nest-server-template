import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./users.model";
import { NotificationSchema, Notification } from "./notifications.model";
import { Timeout, TimeoutSchema } from "./timeout.model";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: User.name, useFactory: () => UserSchema },
      { name: Notification.name, useFactory: () => NotificationSchema },
      { name: Timeout.name, useFactory: () => TimeoutSchema },
    ]),
  ],
  exports: [
    MongooseModule.forFeatureAsync([
      { name: User.name, useFactory: () => UserSchema },
      { name: Notification.name, useFactory: () => NotificationSchema },
      { name: Timeout.name, useFactory: () => TimeoutSchema },
    ]),
  ],
})
export class ModelsModule {}
