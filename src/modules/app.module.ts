import { Module, ValidationPipe } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../common/entities';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AccountModule } from './accounts/account.module';
import { ExpenseModule } from './expenses/expense.module';
import { CategoryModule } from './categories/category.module';
import { BudgetModule } from './budgets/budget.module';
import { SavingHistoryModule } from './saving-history/saving-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          database: config.get('DB_NAME'),
          type: 'sqlite',
          synchronize: true,
          entities,
        };
      },
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_TOKEN_EXPIRES_IN') },
      }),
    }),
    UserModule,
    AccountModule,
    ExpenseModule,
    CategoryModule,
    BudgetModule,
    SavingHistoryModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
