import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  const envConfig = {
    postgres: {
      dbName: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      host: process.env.POSTGRES_HOST,
    },
  };

  return envConfig;
});
