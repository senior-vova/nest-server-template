import { Module, MiddlewareConsumer } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { AppController } from "./app.controller";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { MulterModule } from "@nestjs/platform-express";
import { UserModule } from "./modules/users/users.module";
import { ModelsModule } from "./models/models.module";
import { ConfigModule } from "@nestjs/config";
import { config } from "config/config";
import { MailModule } from "./mail/mail.module";
import { JwtModule } from "./helpers/modules/jwt.module";
import { DatabaseModule } from "./helpers/modules/database.module";
import { UserMiddleware } from "./middlewares/user.middleware";

@Module({
  imports: [
    DatabaseModule,
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: "../public",
      }),
    }),
    ConfigModule.forRoot(config),
    JwtModule,
    AuthModule,
    UserModule,
    ModelsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes("*");
    consumer.apply(UserMiddleware).forRoutes("*");
  }
}
