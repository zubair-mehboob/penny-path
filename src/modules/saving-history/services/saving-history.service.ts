import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavingHistory } from '../saving-history.entity';

@Injectable()
export class SavingHistoryService {
  constructor(
    @InjectRepository(SavingHistory)
    private savingHistoryRepository: Repository<SavingHistory>,
  ) {}
}
