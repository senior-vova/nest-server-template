import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const SetupSwagger = (app: NestExpressApplication) => {
  const options = new DocumentBuilder()
    .setTitle("API documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("auth")
    .addTag("payment")
    .addTag("users")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api/docs", app, document);
};
