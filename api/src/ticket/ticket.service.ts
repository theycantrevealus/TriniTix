import { Injectable } from '@nestjs/common';
import { TicketDto } from '../interfaces/dtos/ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { TicketModel } from '../model/ticket.model';
import {
  ticketCreateRequestFailed,
  ticketCreateRequestSuccess,
  ticketDeleteRequestFailed,
  ticketDeleteRequestSuccess,
  ticketUpdateRequestFailed,
  ticketUpdateRequestSuccess,
} from '../interfaces/dtos/ticket.response.dto';
import { str_pad_left } from '../../utils/string';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketModel)
    private readonly repo: Repository<TicketModel>,
    private readonly jwtService: JwtService,
  ) {}

  async get_all_active() {
    return await this.repo.find({
      withDeleted: true,
      where: { deleted_at: null },
    });
  }

  async get_all_mine(me: string) {
    return await this.repo.find({
      withDeleted: true,
      where: { deleted_at: null, creator: me },
    });
  }

  async get_all() {
    return await this.repo.find({ withDeleted: true });
  }

  async add(data: TicketDto) {
    const process = await this.repo.save(data);
    if (process) {
      return ticketCreateRequestSuccess;
    } else {
      return ticketCreateRequestFailed;
    }
  }

  async update(data: TicketDto) {
    const process = await this.repo.save(data);
    if (process) {
      return ticketUpdateRequestSuccess;
    } else {
      return ticketUpdateRequestFailed;
    }
  }

  async delete_creator(creator: string) {
    const deleteResult = await this.repo.softDelete({ creator: creator });
    if (deleteResult) {
      return ticketDeleteRequestSuccess;
    } else {
      return ticketDeleteRequestFailed;
    }
  }

  async delete_hard_creator(creator: string) {
    const deleteResult = await this.repo.delete({ creator: creator });
    if (deleteResult) {
      return ticketDeleteRequestSuccess;
    } else {
      return ticketDeleteRequestFailed;
    }
  }

  async generate_code() {
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
