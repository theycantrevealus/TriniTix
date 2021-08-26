import { Injectable } from '@nestjs/common';
import { TicketDto } from '../interfaces/dtos/ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { TicketModel } from '../model/ticket.model';
import {
  ticketCreateRequestFailed,
  ticketCreateRequestSuccess,
} from '../interfaces/dtos/ticket.response.dto';
import { str_pad_left } from '../../utils/string';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketModel)
    private readonly repo: Repository<TicketModel>,
    private readonly jwtService: JwtService,
  ) {}
  async ticket_add(data: TicketDto) {
    const process = await this.repo.save(data);
    if (process) {
      return ticketCreateRequestSuccess;
    } else {
      return ticketCreateRequestFailed;
    }
  }

  async generate_ticket_code() {
    const thisYear = new Date().getFullYear();
    const thisMonth = await getConnection()
      .getRepository(TicketModel)
      .createQueryBuilder('ticket')
      .where('EXTRACT(year FROM ticket.created_at) = :year')
      .setParameters({ year: thisYear })
      .getMany();
    return `PDC/${str_pad_left((thisMonth.length + 1).toString(), 5, '0')}`;
  }
}
