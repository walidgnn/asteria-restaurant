import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { CustomThrottlerExceptionFilter } from "./common/throttler-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new CustomThrottlerExceptionFilter());

  app.enableCors({
    origin: ["http://localhost:3000", "http://192.168.100.10:3000"],
  });

  await app.listen(process.env.PORT || 3001);
}
bootstrap();