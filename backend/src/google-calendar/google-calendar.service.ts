import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, calendar_v3 } from 'googleapis';
import * as fs from 'fs';

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private calendar: calendar_v3.Calendar;
  private calendarId: string = 'primary';

  constructor(private configService: ConfigService) {
    this.initializeCalendar();
  }

  private initializeCalendar() {
    try {
      // Check for JSON environment variable ( for Railway deployment)
      const serviceAccountJson = this.configService.get('GOOGLE_SERVICE_ACCOUNT_JSON');
      
      if (serviceAccountJson) {
        this.logger.log('Found GOOGLE_SERVICE_ACCOUNT_JSON environment variable');
        try {
          const serviceAccount = JSON.parse(serviceAccountJson);
          this.logger.log(`Successfully parsed service account JSON for: ${serviceAccount.client_email}`);
          
          this.calendarId = this.configService.get('GOOGLE_CALENDAR_ID') || 'primary';
          this.logger.log(`Using calendar ID: ${this.calendarId}`);

          const auth = new google.auth.GoogleAuth({
            credentials: serviceAccount,
            scopes: ['https://www.googleapis.com/auth/calendar'],
          });

          this.calendar = google.calendar({ version: 'v3', auth });
          this.logger.log('Google Calendar service initialized from environment variable');
          
          this.testCalendarConnection();
          return;
        } catch (parseError) {
          this.logger.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:', parseError);
        }
      }

      //  Fallback to file path (local development)
      const serviceAccountPath = this.configService.get('GOOGLE_SERVICE_ACCOUNT_PATH');
      this.logger.log(`Service account path: ${serviceAccountPath}`);
      
      if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
        this.logger.log('Using service account from file');
        this.calendarId = this.configService.get('GOOGLE_CALENDAR_ID') || 'primary';
        this.logger.log(`Using calendar ID: ${this.calendarId}`);

        const auth = new google.auth.GoogleAuth({
          keyFile: serviceAccountPath,
          scopes: ['https://www.googleapis.com/auth/calendar'],
        });

        this.calendar = google.calendar({ version: 'v3', auth });
        this.logger.log('Google Calendar service initialized from file');
        
        this.testCalendarConnection();
        return;
      }

      this.logger.warn('No Google service account configuration found. Using mock mode.');
      
    } catch (error) {
      this.logger.error('Failed to initialize Google Calendar service:', error);
      if (error instanceof Error) {
        this.logger.error(`Error details: ${error.message}`);
      }
    }
  }

  private async testCalendarConnection() {
    try {
      this.logger.log('Testing Google Calendar connection...');
      const response = await this.calendar.calendars.get({
        calendarId: this.calendarId,
      });
      this.logger.log(`Google Calendar connection successful: ${response.data.summary}`);
    } catch (error) {
      this.logger.error('Google Calendar connection test failed:', error);
      if (error instanceof Error) {
        this.logger.error(`Connection error: ${error.message}`);
      }
    }
  }

  async createEvent(eventDetails: {
    summary: string;
    description?: string;
    start: Date;
    end: Date;
    attendees?: { email: string }[];
  }) {
    if (!this.calendar) {
      this.logger.log('Using mock event creation (calendar service not initialized)');
      return this.createMockEvent(eventDetails);
    }

    const attendeeEmail = eventDetails.attendees?.[0]?.email || 'N/A';
    const fullDescription = `${eventDetails.description || ''}\n\nAttendee Email: ${attendeeEmail}`;

    const event = {
      summary: eventDetails.summary,
      description: fullDescription,
      start: {
        dateTime: eventDetails.start.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: eventDetails.end.toISOString(),
        timeZone: 'UTC',
      },
    };

    try {
      this.logger.log('Creating Google Calendar event...');
      
      const response = await this.calendar.events.insert({
        calendarId: this.calendarId,
        requestBody: event,
        sendUpdates: 'none',
      });

      this.logger.log(`Google Calendar event created successfully: ${response.data.id}`);
      this.logger.log(`🔗 Event link: ${response.data.htmlLink}`);
      return response.data;
    } catch (error: any) {
      this.logger.error(' Failed to create Google Calendar event:');
      this.logger.error(`Error message: ${error.message}`);
      this.logger.error(`Error code: ${error.code}`);
      
      // Fall back to mock
      return this.createMockEvent(eventDetails);
    }
  }

  private createMockEvent(eventDetails: {
    summary: string;
    description?: string;
    start: Date;
    end: Date;
    attendees?: { email: string }[];
  }) {
    const mockEventId = `mock-event-${Date.now()}`;
    this.logger.log(`Created mock Google Calendar event: ${mockEventId}`);
    
    return {
      id: mockEventId,
      htmlLink: 'https://calendar.google.com/calendar/event?mock=true',
      status: 'confirmed',
      summary: eventDetails.summary,
    };
  }
}