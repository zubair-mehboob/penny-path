import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SavingHistoryController } from './controllers/saving-history.controller';
import { SavingHistoryService } from './services/saving-history.service';

@Module({
  imports: [],
  controllers: [SavingHistoryController],
  providers: [SavingHistoryService],
})
export class SavingHistoryModule {}
