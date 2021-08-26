import { padding_left } from '../../../utils/string';
import { StatusService } from '../../../src/status/status.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../../../src/config/orm.config';
import { TicketStatusModel } from '../../../src/model/ticket.status.model';
import { connection } from '../../../src/providers/database.provider';
import { ticketStatusMock } from './mocks/ticket.status.mock';
import { TicketStatusDto } from '../../../src/interfaces/dtos/ticket.status.dto';
import {
  ticketStatusDeleteRequestSuccess,
  ticketStatusUpdateRequestSuccess,
} from '../../../src/interfaces/dtos/ticket.status.response.dto';
import { timeout } from 'rxjs';
const tabSize = 40;
describe(padding_left('📦 [TICKET STATUS SERVICE]', tabSize / 2, ' '), () => {
  let module: TestingModule;
  let service: StatusService;

  beforeAll(async () => {
    //await connection.create();
    module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: `${process.env.JWT_SECRET}`,
        }),
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([TicketStatusModel], 'default'),
      ],
      providers: [StatusService],
    }).compile();

    service = module.get<StatusService>(StatusService);
    const oldData = await service.get_all();
    for (const item of oldData) {
      await service.ticket_status_delete_hard(item.uid);
    }
  });

  it(
    padding_left('[SERVICE STATE] 💎 ⇒ ', tabSize, ' ') +
      'Service should be defined',
    () => {
      expect(service).toBeDefined();
    },
  );

  it(
    /*eslint-disable-next-line*/
          padding_left('[INIT TICKET STATUS] 💾 ⇒ ', tabSize, ' ') + 'Create init ticket status. Equal to insert',
    async () => {
      const initData = ticketStatusMock;
      let counter = 0;
      for (let a = 0; a < initData.length; a++) {
        const initDataResult = await service.ticket_status_add(
          TicketStatusDto.from({
            name: initData[a].name,
          }),
        );
        if (initDataResult) {
          counter++;
        }
      }
      expect(counter).toBe(initData.length);
    },
  );

  it(
    /*eslint-disable-next-line*/
      padding_left('[LOAD TICKET STATUS LIST] 💾 ⇒ ', tabSize, ' ') + 'Load all active ticket status',
    async () => {
      const getData = await service.get_all_active();
      expect(getData.length).toBeGreaterThan(0);
    },
  );

  /*it(
    /!*eslint-disable-next-line*!/
      padding_left('[LOAD TICKET STATUS LIST] 💾 ⇒ ', tabSize, ' ') + 'Soft delete a ticket status',
    async () => {
      const getData = await service.get_all_active();
      expect(getData.length).toBeGreaterThan(0);

      const deleteTopData = await service.ticket_status_delete_soft(
        getData[0].uid,
      );

      expect(deleteTopData).toBe(ticketStatusDeleteRequestSuccess);
    },
  );

  it(
    /!*eslint-disable-next-line*!/
        padding_left('[LOAD TICKET STATUS LIST] 💾 ⇒ ', tabSize, ' ') + 'Update a ticket status',
    async () => {
      const getData = await service.get_all_active();
      expect(getData.length).toBeGreaterThan(0);

      const updateTopData = await service.ticket_status_update(
        TicketStatusDto.from({
          uid: getData[0].uid,
          name: 'Kentut',
        }),
      );

      expect(updateTopData).toBe(ticketStatusUpdateRequestSuccess);
    },
  );*/

  afterAll(async () => {
    /*const userData = await service.get_all();
    for (const item of userData) {
      await service.ticket_status_delete_hard(item.uid);
    }*/
    await connection.close();
    //await module.close();
  });
});
