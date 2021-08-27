import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { TicketStatusModel } from '../model/ticket.status.model';
import { TicketStatusDto } from '../interfaces/dtos/ticket.status.dto';
import {
  ticketStatusCreateRequestDup,
  ticketStatusCreateRequestFailed,
  ticketStatusCreateRequestSuccess,
  ticketStatusDeleteRequestFailed,
  ticketStatusDeleteRequestSuccess,
  ticketStatusUpdateRequestFailed,
  ticketStatusUpdateRequestSuccess,
} from '../interfaces/dtos/ticket.status.response.dto';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(TicketStatusModel)
    private readonly repo: Repository<TicketStatusModel>,
  ) {}
  async get_all() {
    return await this.repo.find({ withDeleted: true });
  }

  async get_all_active() {
    return await this.repo.find({
      withDeleted: true,
      where: { deleted_at: null },
    });
  }

  async get_search(name: string) {
    return await getConnection()
      .getRepository(TicketStatusModel)
      .createQueryBuilder('ticket_status')
      .where('deleted_at IS NULL')
      .orderBy('created_at', 'DESC')
      .andWhere(`name ILIKE '%${name}%'`)
      .getMany();
  }

  async delete_hard(uid: string) {
    const deleteResult = await this.repo.delete({ uid: uid });
    if (deleteResult) {
      return ticketStatusDeleteRequestSuccess;
    } else {
      return ticketStatusDeleteRequestFailed;
    }
  }

  async delete_soft(uid: string) {
    const deleteResult = await this.repo.softDelete({ uid: uid });
    if (deleteResult) {
      return ticketStatusDeleteRequestSuccess;
    } else {
      return ticketStatusDeleteRequestFailed;
    }
  }

  async add(ticketStatusDTO: TicketStatusDto) {
    const check = await this.ticket_status_duplicate_check(
      ticketStatusDTO.name,
    );
    if (!check) {
      const createdResult = await this.repo.save(
        TicketStatusDto.createModel(ticketStatusDTO),
      );
      if (createdResult) {
        return ticketStatusCreateRequestSuccess;
      } else {
        return ticketStatusCreateRequestFailed;
      }
    } else {
      return ticketStatusCreateRequestDup;
    }
  }

  async update(ticketStatusDTO: TicketStatusDto) {
    const updatedResult = await this.repo.save(
      TicketStatusDto.createModel(ticketStatusDTO),
    );
    if (updatedResult) {
      return ticketStatusUpdateRequestSuccess;
    } else {
      return ticketStatusUpdateRequestFailed;
    }
  }

  async ticket_status_duplicate_check(name: string) {
    return await getConnection()
      .getRepository(TicketStatusModel)
      .createQueryBuilder('ticket_status')
      .where('deleted_at IS NULL')
      .orderBy('created_at', 'DESC')
      .andWhere('name = :name')
      .setParameters({ name: name })
      .getOne();
  }
}
