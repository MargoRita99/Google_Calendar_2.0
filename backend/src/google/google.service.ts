import { Injectable } from '@nestjs/common';
import { google, calendar_v3 } from 'googleapis';

@Injectable()
export class GoogleService {
  async getEvents(tokens: any): Promise<calendar_v3.Schema$Event[]> {
    const auth = new google.auth.OAuth2();
    auth.setCredentials(tokens);

    const calendar = google.calendar({ version: 'v3', auth });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(), 
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );

    auth.setCredentials({
      refresh_token: refreshToken,
    });

    const tokenResponse = await auth.getAccessToken();

    return {
      accessToken: tokenResponse.token || '',
      refreshToken, 
    };
  }
}
