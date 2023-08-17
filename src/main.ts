import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { PrismaDatabase } from './prisma/prisma.service';
import { AllExceptionsFilter } from './filters/allException.filter';
import hpp from 'hpp';
import helmet from 'helmet';

class Application {
    private readonly PORT: number;
    private readonly configService: ConfigService;
    private readonly prismaDatabase: PrismaDatabase;

    constructor(private readonly app: NestExpressApplication) {
        this.configService = app.get(ConfigService);
        this.prismaDatabase = app.get(PrismaDatabase);
        this.PORT = parseInt(this.configService.get('PORT') as string);
    }

    private async setUpGlobalMiddleware() {
        this.app.use(hpp());
        this.app.use(helmet());

        this.app.useGlobalFilters(new AllExceptionsFilter(this.prismaDatabase, this.configService));
    }
    async start() {
        this.prismaDatabase.enableShutdownHooks(this.app);

        await this.setUpGlobalMiddleware();
        await this.app.listen(this.PORT, () => {
            console.log(`
      #############################################
          🛡️ Server listening on port: ${this.PORT} 🛡️
          🛡️ Server env: ${this.configService.get('NODE_ENV')} 🛡️
      #############################################    
      `);
        });
    }
}

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const server = new Application(app);

    await server.start();
}

bootstrap().catch((error) => console.log(`Server error!!! : ${error}`));
