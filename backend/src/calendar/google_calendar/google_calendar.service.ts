import { Injectable } from '@nestjs/common';
import { google, calendar_v3 } from 'googleapis';

@Injectable()
export class GoogleService {
  async getEvents(tokens: { access_token: string; refresh_token: string }): Promise<calendar_v3.Schema$Event[]> {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );

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

  async refreshAccessToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string; expiry_date: number }> {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );

    auth.setCredentials({ refresh_token: refreshToken });

    const response = await auth.refreshAccessToken(); 
    const tokens = response.credentials; 

    if (!tokens || !tokens.access_token) {
      throw new Error('Failed to refresh access token');
    }

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || refreshToken, 
      expiry_date: tokens.expiry_date || Date.now() + 3600 * 1000, 
    };
  }
}