import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environments } from 'environments';
import configSchema from './configSchema';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import config from './config';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || '.env',
      isGlobal: true,
      load: [config],
      validationSchema: configSchema,
    }),
    DatabaseModule,
    // HealthModule,
    UserModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
