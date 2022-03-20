import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { SetupSwagger } from "./swagger";

const PORT = process.env.PORT || 3333;
const URL = process.env.SERVER_URL || "http://localhost:" + PORT;
const IS_PROD = process.env.NODE_ENV == "prod";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: ["warn", "error"],
  });

  app.useGlobalPipes(new ValidationPipe());

  if (!IS_PROD) SetupSwagger(app);

  await app.listen(PORT);
}

bootstrap().then(() => {
  console.info("Server is started on port:", PORT);
  if (!IS_PROD) console.info("Swagger url is:", `${URL}/api/docs`);
});
