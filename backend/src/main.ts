import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { CreateApplicationDto } from '@common/dto/applications/create-application.dto';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ErrorHandlingInterceptor } from './common/interceptors/error-handling.interceptor';
import { CustomLogger } from './common/services/logger.service';

async function bootstrap() {
  // Initialize app with default logger
  const app = await NestFactory.create(AppModule);

  // Get config service and create custom logger
  const configService = app.get(ConfigService);
  const logger = new CustomLogger(configService);
  app.useLogger(logger);

  logger.setContext('Bootstrap');
  logger.logDevelopmentInfo('Starting application bootstrap...');

  try {
    // Configure global middleware
    configureGlobalMiddleware(app, logger);

    // Add request logging middleware
    configureRequestLogging(app, logger);

    // Configure CORS
    configureCors(app, configService, logger);

    // Configure and setup Swagger documentation
    setupSwagger(app, logger);

    // Start the server
    const port = configService.get('server.port');
    const host = '0.0.0.0';
    await app.listen(port, host);

    // Log server information
    await logServerInformation(app, port, logger);
  } catch (error) {
    logger.error('Failed to start application', error.stack);
    process.exit(1);
  }
}

function configureGlobalMiddleware(app: any, logger: CustomLogger) {
  logger.debug('Configuring global middleware');

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalInterceptors(new ErrorHandlingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
}

function configureRequestLogging(app: any, logger: CustomLogger) {
  logger.debug('Configuring request logging middleware');

  app.use((req: any, res: any, next: () => void) => {
    logger.debug(
      'Incoming request',
      JSON.stringify({
        method: req.method,
        url: req.url,
        headers: req.headers,
      }),
    );

    // Capture response headers after they're set
    const oldEnd = res.end;
    res.end = function (...args: any[]) {
      logger.debug(
        'Outgoing response',
        JSON.stringify({
          statusCode: res.statusCode,
          headers: res.getHeaders(),
        }),
      );
      return oldEnd.apply(res, args);
    };
    next();
  });
}

function configureCors(app: any, configService: ConfigService, logger: CustomLogger) {
  const frontendUrl = configService.get('url.frontend');
  logger.log(`Configuring CORS with frontend URL: ${frontendUrl}`);

  app.enableCors({
    origin: [frontendUrl, /^http:\/\/192\.168\.1\.\d{1,3}:\d+$/, 'http://100.65.62.87:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    exposedHeaders: ['Content-Disposition'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
}

function setupSwagger(app: any, logger: CustomLogger) {
  logger.debug('Setting up Swagger documentation');

  const config = new DocumentBuilder()
    .setTitle('Research Engine API')
    .setDescription('University of Miami Research Engine API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [CreateApplicationDto],
  });
  SwaggerModule.setup('api', app, document);
}

async function logServerInformation(app: any, port: number, logger: CustomLogger) {
  const serverUrl = await app.getUrl();

  logger.logObject(
    'log',
    {
      endpoints: {
        local: `http://localhost:${port}`,
        ipv6: serverUrl,
        ipv4: `http://127.0.0.1:${port}`,
        swagger: `http://localhost:${port}/api`,
      },
    },
    'Server is running at:',
  );
}

// Handle unhandled bootstrap errors
bootstrap().catch((error) => {
  console.error('Unhandled bootstrap error:', error);
  process.exit(1);
});
