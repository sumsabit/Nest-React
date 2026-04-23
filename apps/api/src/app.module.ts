import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { LawModule } from './laws/law.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HistoryModule } from './history/history.module';
import { BookmarkModule } from './book-mark/bookmark.module';
import { AdminModule } from './admin/admin.module';
import { ChatModule } from './chat/chat.module';
import { FeedbackModule } from './feedback/feedback.module';



@Module({
  imports: [
    // Global Config
    ConfigModule.forRoot({ isGlobal: true }),

    // Mailer
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: config.get<string>('MAIL_USER') || 'ethiopianlaw.guidance@gmail.com',
            pass: config.get<string>('MAIL_PASS') || 'acld hvmb aeps bgjn',
          },
        },
        defaults: {
          from: `"Ethiopian Law Guidance" <${config.get<string>('MAIL_USER')}>`,
        },
      }),
    }),

    // TypeORM
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
         type: 'postgres',
    host: config.get<string>('DB_HOST'),
    port: config.get<number>('DB_PORT'),
    username: config.get<string>('DB_USERNAME'),
    password: config.get<string>('DB_PASSWORD'),
    database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        logging: config.get<string>('DB_LOGGING') === 'true',
      }),
    }),

    // App modules
    LawModule,  
   BookmarkModule, 
   HistoryModule,
    UsersModule,
    AuthModule,
    AdminModule,
    ChatModule,
    FeedbackModule,
    

  ],

})
export class AppModule {}