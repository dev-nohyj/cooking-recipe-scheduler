import { SchedulerModule } from './scheduler/scheduler.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './prisma/database.module';

@Module({
    imports: [
        SchedulerModule,
        ConfigModule.forRoot({ isGlobal: true }),
        RedisModule.forRoot({
            config: {
                url: process.env.REDIS_URL,
                retryStrategy: (times: number) => Math.max(times * 100, 3000),
            },
        }),
        DatabaseModule,
    ],
})
export class AppModule {}
