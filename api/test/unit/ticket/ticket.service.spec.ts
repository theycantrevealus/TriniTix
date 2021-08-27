import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from '../../../src/ticket/ticket.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../../../src/config/orm.config';
import { TicketStatusModel } from '../../../src/model/ticket.status.model';
import { TicketModel } from '../../../src/model/ticket.model';
import { UserModel } from '../../../src/model/user.model';
import { connection } from '../../../src/providers/database.provider';
import { padding_left } from '../../../utils/string';
import 'jest-extended';
import { getConnection } from 'typeorm';
import { UserService } from '../../../src/user/user.service';
import { UserDTO } from '../../../src/interfaces/dtos/user.dto';
import { userMockAdd } from '../user/mocks/user.mock';
import { userCreateRequestSuccess } from '../../../src/interfaces/dtos/user.response.dto';
import { TicketDto } from '../../../src/interfaces/dtos/ticket.dto';
import { StatusService } from '../../../src/status/status.service';
import { ticketMock } from './mocks/ticket.mock';
import {
  ticketCreateRequestSuccess,
  ticketDeleteRequestSuccess,
  ticketUpdateRequestSuccess,
} from '../../../src/interfaces/dtos/ticket.response.dto';
import exp from 'constants';
import { ticketStatusMock } from './status/mocks/ticket.status.mock';
import { TicketStatusDto } from '../../../src/interfaces/dtos/ticket.status.dto';
const tabSize = 40;
describe(padding_left('📦 [TICKET SERVICE]', tabSize, ' '), () => {
  let ticketService: TicketService;
  let userService: UserService;
  let ticketStatusService: StatusService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: `${process.env.JWT_SECRET}`,
        }),
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature(
          [TicketModel, TicketStatusModel, UserModel],
          'default',
        ),
      ],
      providers: [TicketService, StatusService, UserService],
    }).compile();

    ticketService = module.get<TicketService>(TicketService);
    userService = module.get<UserService>(UserService);
    ticketStatusService = module.get<StatusService>(StatusService);

    const userData = await userService.get_all();
    for (const item of userData) {
      await ticketService.delete_hard_creator(item.uid);
      await userService.delete_hard(item.uid);
    }

    const oldData = await ticketStatusService.get_all();
    for (const item of oldData) {
      await ticketStatusService.delete_hard(item.uid);
    }
  });

  it(
    /*eslint-disable-next-line*/
      padding_left('[SERVICE STATE] 💎 ⇒ ', tabSize, ' ') + 'Service should be defined',
    async () => {
      expect(ticketService).toBeDefined();
    },
  );

  it(
    /*eslint-disable-next-line*/
      padding_left('[CONNECTION STATE] 📀 ⇒ ', tabSize, ' ') + 'DB connection must be established',
    () => {
      expect(getConnection().isConnected).toBeTrue();
    },
  );

  it(
    /*eslint-disable-next-line*/
        padding_left('[INIT TICKET STATUS] 💾 ⇒ ', tabSize, ' ') + 'Create init ticket status. Equal to insert',
    async () => {
      const initData = ticketStatusMock;
      let counter = 0;
      for (let a = 0; a < initData.length; a++) {
        const initDataResult = await ticketStatusService.add(
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
      padding_left('[TICKET ADD] 💾 ⇒ ', tabSize, ' ') + 'Init User. Add New Ticket',
    async () => {
      const findSpy = jest.spyOn(ticketService, 'add');
      const dto = UserDTO.from(userMockAdd);
      const sampleUser = await userService.insert(dto);
      expect(sampleUser).toBe(userCreateRequestSuccess);
      const getSampleUser = await userService.get_active();
      expect(getSampleUser.length).toBeGreaterThan(0);
      const newStatus = await ticketStatusService.get_search('New');
      const code = await ticketService.generate_code();
      const sampleTicket: TicketDto = TicketDto.from({
        title: ticketMock.title,
        code: code,
        content: ticketMock.content,
        creator: getSampleUser[0].uid,
        status: newStatus[0].uid,
      });
      const result = await ticketService.add(sampleTicket);
      expect(findSpy).toHaveBeenCalledWith(sampleTicket);
      expect(result).toBe(ticketCreateRequestSuccess);
    },
  );

  it(
    /*eslint-disable-next-line*/
        padding_left('[TICKET UPDATE STATUS] 💾 ⇒ ', tabSize, ' ') + 'Update ticket status',
    async () => {
      const findSpy = jest.spyOn(ticketService, 'update');
      const newStatus = await ticketStatusService.get_search('Progress');
      expect(newStatus.length).toBeGreaterThan(0);
      const sampleTicketData = await ticketService.get_all_active();
      expect(sampleTicketData.length).toBeGreaterThan(0);
      sampleTicketData[0].status = newStatus[0].uid;
      const sampleTicket: TicketDto = TicketDto.from(sampleTicketData[0]);
      const result = await ticketService.update(sampleTicket);
      expect(findSpy).toHaveBeenCalledWith(sampleTicket);
      expect(result).toBe(ticketUpdateRequestSuccess);
    },
  );

  it(
    /*eslint-disable-next-line*/
        padding_left('[TICKET DELETE] 💾 ⇒ ', tabSize, ' ') + 'User delete his ticket (SOFT). It will be verified automatically',
    async () => {
      const findSpy = jest.spyOn(ticketService, 'delete_creator');
      const getSampleTicket = await ticketService.get_all_active();
      expect(getSampleTicket.length).toBeGreaterThan(0);
      const newStatus = await ticketStatusService.get_search('Verified');
      expect(newStatus.length).toBeGreaterThan(0);
      getSampleTicket[0].status = newStatus[0].uid;
      const updateStatus = await ticketService.update(
        TicketDto.from(getSampleTicket[0]),
      );
      expect(updateStatus).toBe(ticketUpdateRequestSuccess);
      const result = await ticketService.delete_creator(
        getSampleTicket[0].creator,
      );
      expect(findSpy).toHaveBeenCalledWith(getSampleTicket[0].creator);
      expect(result).toBe(ticketDeleteRequestSuccess);
    },
  );

  afterAll(async () => {
    const userData = await userService.get_all();
    for (const item of userData) {
      await ticketService.delete_hard_creator(item.uid);
    }
    await connection.close();
    //await module.close();
  });
});
