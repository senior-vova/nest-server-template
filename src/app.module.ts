import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { AppController } from "./app.controller";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { MulterModule } from "@nestjs/platform-express";
import { UserModule } from "./modules/users/users.module";
import { ModelsModule } from "./models/models.module";
import { ConfigModule } from "@nestjs/config";
import { config } from "config/config";
import { MailModule } from "./mail/mail.module";
import { SocketModule } from "./socket/socket.module";
import { JwtModule } from "./helpers/modules/jwt.module";
import { DatabaseModule } from "./helpers/modules/database.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { JsonBodyMiddleware, RawBodyMiddleware } from "./middlewares/json-raw.middleware";
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
    SocketModule,
    ModelsModule,
    MailModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RawBodyMiddleware).forRoutes({
      path: "payment/check-payment-intent/webhook",
      method: RequestMethod.POST,
    });
    consumer.apply(JsonBodyMiddleware).forRoutes("*");
    consumer.apply(AuthMiddleware).forRoutes("*");
    consumer.apply(UserMiddleware).forRoutes("*");
  }
}
