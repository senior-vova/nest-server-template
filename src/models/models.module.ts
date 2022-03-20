import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./users.model";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: User.name, useFactory: () => UserSchema },
    ]),
  ],
  exports: [
    MongooseModule.forFeatureAsync([
      { name: User.name, useFactory: () => UserSchema },
    ]),
  ],
})
export class ModelsModule {}
