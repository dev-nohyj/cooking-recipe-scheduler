import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [ScheduleModule.forRoot()],
    controllers: [],
    providers: [SchedulerService],
})
export class SchedulerModule {}
