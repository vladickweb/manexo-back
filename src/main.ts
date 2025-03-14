import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Permitir el origen del frontend
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS', // Incluir OPTIONS
    allowedHeaders: 'Content-Type,Authorization', // Asegurarse de que se permiten estas cabeceras
    credentials: true, // Si se necesitan cookies o cabeceras con credenciales
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no declaradas en el DTO
      forbidNonWhitelisted: true, // Lanza un error si hay propiedades no declaradas
      transform: true, // Transforma datos automáticamente a los tipos especificados
    }),
  );

  await app.listen(3000);
}
bootstrap();
