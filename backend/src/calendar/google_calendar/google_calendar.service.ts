import { Injectable } from '@nestjs/common';
import { google, calendar_v3 } from 'googleapis';

@Injectable()
export class GoogleService {
  // Получение событий из Google Calendar
  async getEvents(tokens: { access_token: string; refresh_token: string }): Promise<calendar_v3.Schema$Event[]> {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );

    auth.setCredentials(tokens); // Устанавливаем токены пользователя

    const calendar = google.calendar({ version: 'v3', auth });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(), // Только будущие события
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  }

  // Обновление access-токена с использованием refresh-токена
  async refreshAccessToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string; expiry_date: number }> {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );

    // Устанавливаем refreshToken
    auth.setCredentials({ refresh_token: refreshToken });

    // Обновляем токены
    const response = await auth.refreshAccessToken(); // Возвращает RefreshAccessTokenResponse
    const tokens = response.credentials; // Данные токенов находятся в `credentials`

    // Проверяем, что обновление прошло успешно
    if (!tokens || !tokens.access_token) {
      throw new Error('Failed to refresh access token');
    }

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || refreshToken, // Обновляем refresh_token, если он изменился
      expiry_date: tokens.expiry_date || Date.now() + 3600 * 1000, // Указываем дату истечения, если она отсутствует
    };
  }
}