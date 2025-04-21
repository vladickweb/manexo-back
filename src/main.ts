import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permitir múltiples orígenes: el local y el de producción en Vercel
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://menexo-front-mctfrfo05-vladickwebs-projects.vercel.app',
    ],
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configurar Swagger
  await AppModule.setupSwagger(app);

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Aplicación escuchando en el puerto ${port}`);
  });
}
bootstrap();
