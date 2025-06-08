import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    cors: {
      origin: [
        '*',
        'http://192.168.1.155:5173',
        'http://localhost:5173',
        'https://menexo-front.vercel.app',
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature'],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });

  app.use(
    json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
    }),
  );

  await AppModule.setupSwagger(app);

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Aplicación escuchando en el puerto ${port}`);
  });
}
bootstrap();
