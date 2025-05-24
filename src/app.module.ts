import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environments } from 'environments';
import configSchema from './configSchema';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ServiceModule } from './service/service.module';
import { CategoryModule } from './category/category.module';
import { ContractModule } from './contract/contract.module';
import { ReviewModule } from './review/review.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { FavoriteModule } from './favorite/favorite.module';
import config from './config';
import dataSource from './db/data-source';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AvailabilityModule } from './availability/availability.module';
import { BookingModule } from './booking/booking.module';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || '.env',
      isGlobal: true,
      load: [config],
      validationSchema: configSchema,
    }),
    TypeOrmModule.forRoot(dataSource.options),
    UserModule,
    AuthModule,
    ServiceModule,
    CategoryModule,
    ContractModule,
    ReviewModule,
    FavoriteModule,
    CloudinaryModule,
    AvailabilityModule,
    BookingModule,
    ChatsModule,
  ],
  providers: [],
})
export class AppModule {
  static async setupSwagger(app) {
    const config = new DocumentBuilder()
      .setTitle('Manexo API')
      .setDescription('API documentation for Manexo application')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // Guardar la especificación OpenAPI como archivo JSON
    writeFileSync(
      join(process.cwd(), 'openapi-spec.json'),
      JSON.stringify(document, null, 2),
    );

    SwaggerModule.setup('api', app, document, {
      customSiteTitle: 'Manexo API Documentation',
      customfavIcon:
        'https://avatars.githubusercontent.com/u/6936373?s=200&v=4',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
      ],
      customCssUrl: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      ],
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        tryItOutEnabled: true,
        supportedSubmitMethods: [
          'get',
          'put',
          'post',
          'delete',
          'options',
          'head',
          'patch',
          'trace',
        ],
      },
    });
  }
}
