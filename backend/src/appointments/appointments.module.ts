import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './appointments.entity';
import { GoogleCalendarModule } from '../google-calendar/google-calendar.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), GoogleCalendarModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}