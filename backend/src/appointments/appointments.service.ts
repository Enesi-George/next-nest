import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointments.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private googleCalendarService: GoogleCalendarService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = this.appointmentsRepository.create(createAppointmentDto);
    const savedAppointment = await this.appointmentsRepository.save(appointment);

    try {
      const event = await this.googleCalendarService.createEvent({
        summary: `Appointment with ${createAppointmentDto.name}`,
        description: createAppointmentDto.notes,
        start: new Date(createAppointmentDto.appointmentDateTime),
        end: new Date(new Date(createAppointmentDto.appointmentDateTime).getTime() + 60 * 60 * 1000), // 1 hour
        attendees: [{ email: createAppointmentDto.email }],
      });

      savedAppointment.googleEventId = event.id;
      return await this.appointmentsRepository.save(savedAppointment);
    } catch (error) {
      // If Google Calendar fails, still return the appointment but log the error
      console.error('Failed to create Google Calendar event:', error);
      return savedAppointment;
    }
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      order: { appointmentDateTime: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Appointment> {
    return this.appointmentsRepository.findOne({ where: { id } });
  }
}