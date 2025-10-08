import { Module } from '@nestjs/common';
import { IncomeController } from './controllers/income.controller';
import { IncomeService } from './services/income.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './income.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Income])],
  controllers: [IncomeController],
  providers: [IncomeService],
})
export class IncomeModule {}
