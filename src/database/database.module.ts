import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { Client } from 'pg';

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions)],
  providers: [
    {
      provide: 'PG',
      useFactory: (configService: ConfigService) => {
        const { user, host, dbName, password, port } =
          configService.get('config.postgres');
        return new Client({
          user,
          host,
          database: dbName,
          password,
          port,
          ssl:
            configService.get('config.nodeEnv') === 'production'
              ? { rejectUnauthorized: false }
              : false,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['PG'],
})
export class DatabaseModule {}
