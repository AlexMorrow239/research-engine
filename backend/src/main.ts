/**
 * Bootstrap file for the Research Engine API
 * Configures and initializes the NestJS application with necessary middleware,
 * validation pipes, Swagger documentation, and error handling.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ErrorHandlingInterceptor } from './common/interceptors/error-handling.interceptor';

import { CreateApplicationDto } from '@common/dto/applications/create-application.dto';

const logger = new Logger('Bootstrap');

/**
 * Bootstrap the NestJS application with all necessary configurations
 * @throws {Error} If application fails to start
 */
async function bootstrap() {
  logger.log('Starting application bootstrap...');

  try {
    // Initialize NestJS application with detailed logging
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug'],
    });

    logger.log(
      `Configuring CORS with frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`,
    );

    // Configure global middleware
    configureGlobalMiddleware(app);

    // Add request logging middleware
    app.use((req, res, next) => {
      logger.debug(`Incoming ${req.method} request to ${req.url}`);
      logger.debug('Request headers:', req.headers);

      // Capture response headers after they're set
      const oldEnd = res.end;
      res.end = function (...args) {
        logger.debug('Response headers:', res.getHeaders());
        return oldEnd.apply(res, args);
      };
      next();
    });

    // Enable CORS with specific configuration
    app.enableCors({
      origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        /^http:\/\/192\.168\.1\.\d{1,3}:\d+$/,
        'http://100.65.62.87:5173',
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
      exposedHeaders: ['Content-Disposition'],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    // Configure and setup Swagger documentation
    setupSwagger(app);

    // Start the server on specified port with explicit host binding
    const port = process.env.PORT ?? 3000;
    const host = '0.0.0.0'; // This will bind to all network interfaces
    await app.listen(port, host);

    // Get the actual URL and log it
    const serverUrl = await app.getUrl();
    logger.log(`Application is running on http://localhost:${port}`);
    logger.log(`Alternative URLs:`);
    logger.log(` - Local IPv6: ${serverUrl}`);
    logger.log(` - Local IPv4: http://127.0.0.1:${port}`);
    logger.log(`Swagger documentation available at http://localhost:${port}/api`);
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

/**
 * Configure global middleware for the application
 * @param app NestJS application instance
 */
function configureGlobalMiddleware(app: any) {
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(new ErrorHandlingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
}

/**
 * Setup Swagger documentation
 * @param app NestJS application instance
 */
function setupSwagger(app: any) {
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

// Handle unhandled bootstrap errors
bootstrap().catch((error) => {
  logger.error('Unhandled bootstrap error:', error);
  process.exit(1);
});
