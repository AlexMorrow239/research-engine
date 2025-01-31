import { registerAs } from '@nestjs/config';

export const environmentConfig = registerAs('environment', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  isNetworkMode: process.env.NETWORK_MODE === 'true',
}));

export const urlConfig = registerAs('url', () => {
  const isNetworkMode = process.env.NETWORK_MODE === 'true';
  const nodeEnv = process.env.NODE_ENV || 'development';

  return {
    frontend:
      nodeEnv === 'production'
        ? process.env.FRONTEND_URL
        : isNetworkMode
          ? process.env.FRONTEND_URL_NETWORK
          : process.env.FRONTEND_URL_LOCAL,
  };
});

export const databaseConfig = registerAs('database', () => ({
  uri: process.env.MONGODB_URI,
}));

export const serverConfig = registerAs('server', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV,
}));

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  downloadSecret: process.env.JWT_DOWNLOAD_SECRET,
}));

export const awsConfig = registerAs('aws', () => ({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucketName: process.env.AWS_BUCKET_NAME,
}));

export const emailConfig = registerAs('email', () => ({
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
  fromAddress: process.env.SMTP_FROM_ADDRESS,
}));
