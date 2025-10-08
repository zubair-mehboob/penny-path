import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavingHistory } from './saving-history.entity';
import { SavingHistoryController } from './controllers/saving-history.controller';
import { SavingHistoryService } from './services/saving-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([SavingHistory])],
  controllers: [SavingHistoryController],
  providers: [SavingHistoryService],
})
export class SavingHistoryModule {}
