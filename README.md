# Google_Calendar_2.0
## Описание проекта
Веб-приложение "Календарь" представляет собой систему для управления событиями, которая интегрируется с Google Календарем. Основной функционал приложения:

Регистрация и авторизация пользователей.
Интеграция с Google Календарем.
Отображение событий из Google Календаря в личном кабинете пользователя.
Возможность редактировать события в личном кабинете, без обратной синхронизации с Google Календарем.
Синхронизация с Google Календарем каждую минуту.
Поддержка повторяющихся событий, с возможностью редактировать каждое событие независимо от других повторов.
Структура веб-приложения
1. Регистрация
Поля:
email
пароль
повторите пароль
2. Авторизация
Поля:
email
пароль
3. Интеграция с Google Календарем
Кнопка "Подключиться" для интеграции с Google Календарем.
После успешной интеграции появляется блок с настройками, где пользователь может выбрать календари для синхронизации.
4. Календарь событий
Отображение календаря с событиями, синхронизированными с Google Календарем.
Возможность редактирования событий в личном кабинете.
5. Редактирование событий
Возможность редактировать события, синхронизированные с Google Календарем.
Изменения, сделанные в личном кабинете, не синхронизируются обратно в Google Календарь, однако если событие было изменено в Google, оно будет обновлено в приложении.
Логика взаимодействия
1. Регистрация и Авторизация
Для регистрации и авторизации используется стандартная форма с email и паролем.
При регистрации создается новый пользователь в базе данных, и его данные (включая токены Google для синхронизации) сохраняются в системе.
После авторизации пользователи могут интегрировать свое приложение с Google Календарем для синхронизации данных.
2. Интеграция с Google Календарем
Для интеграции с Google Календарем используется OAuth2 аутентификация через API Google.
После успешной авторизации пользователю предоставляется возможность выбрать календари для синхронизации с приложением.
Приложение сохраняет access token и refresh token, чтобы периодически обновлять данные о событиях из выбранных календарей.
3. Синхронизация событий
Приложение синхронизирует события с Google Календарем каждую минуту.
Время синхронизации и обновления событий задается на backend, где происходит регулярное получение данных из Google Календаря и их обновление в базе данных приложения.
4. Редактирование событий
События из Google Календаря отображаются в личном кабинете пользователя.
Пользователь может редактировать события в личном кабинете, но изменения не синхронизируются обратно с Google.
Если событие было изменено в Google Календаре (например, пользователь изменил его в мобильном приложении), оно будет автоматически обновлено в нашем приложении.
Как подключаемся к Google Календарю
Шаг 1: Авторизация через Google OAuth2
Для интеграции с Google Календарем мы используем Google API и механизм OAuth2 для получения токенов доступа. В нашем приложении мы используем библиотеку googleapis для работы с API Google.

Пример кода для авторизации и получения токенов доступа:

import { google } from 'googleapis';

// Функция для авторизации пользователя и получения токенов
async function authenticateWithGoogle() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  // Получение токенов через redirect URI
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
}
Шаг 2: Получение событий из Google Календаря
Для того чтобы синхронизировать события с Google Календарем, мы используем Google Calendar API.

Пример кода для получения событий:


import { google } from 'googleapis';

// Функция для получения событий из Google Календаря
async function getGoogleCalendarEvents(tokens: any) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials(tokens); // Устанавливаем полученные токены

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  // Получаем события из основного календаря
  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(), // Только будущие события
    maxResults: 100,
    singleEvents: true,
    orderBy: 'startTime',
  });

  return response.data.items || [];
}
Шаг 3: Обновление событий в базе данных
После получения данных из Google Календаря мы синхронизируем эти события с базой данных, добавляя их или обновляя, если они уже существуют.

Пример кода для синхронизации:

import { EventService } from 'src/event/event.service';

// Синхронизация полученных событий с базой данных
async function syncEventsWithDatabase(userId: number, googleEvents: any[]) {
  for (const event of googleEvents) {
    const existingEvent = await eventService.findByGoogleEventId(event.id);
    if (existingEvent) {
      // Обновление события
      existingEvent.title = event.summary;
      existingEvent.startDate = new Date(event.start.dateTime || event.start.date);
      existingEvent.endDate = new Date(event.end.dateTime || event.end.date);
      await eventService.updateEvent(existingEvent);
    } else {
      // Добавление нового события
      const newEvent = {
        title: event.summary,
        startDate: new Date(event.start.dateTime || event.start.date),
        endDate: new Date(event.end.dateTime || event.end.date),
        googleEventId: event.id,
        userId,
      };
      await eventService.createEvent(newEvent);
    }
  }
}
Технологии, использованные в проекте
Frontend:

React.js для пользовательского интерфейса
Axios для выполнения HTTP-запросов к backend
Backend:

NestJS для создания RESTful API
TypeORM для работы с базой данных
Google APIs для интеграции с Google Календарем
База данных:

PostgreSQL или другая SQL-база данных для хранения данных о пользователях, событиях и календарях
Автоматическая синхронизация:

Используется cron-задание для синхронизации событий с Google Календарем каждую минуту.