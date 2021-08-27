import { padding_left } from '../../../utils/string';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../../../src/config/orm.config';
import { UserModel } from '../../../src/model/user.model';
import { getConnection } from 'typeorm';
import { UserDTO, UserLoginDTO } from '../../../src/interfaces/dtos/user.dto';
import { userMockAdd, userMockEdit } from './mocks/user.mock';
import 'jest-extended';
import { HttpStatus } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { connection } from '../../../src/providers/database.provider';
import { TicketService } from '../../../src/ticket/ticket.service';
import { TicketModel } from '../../../src/model/ticket.model';
import {
  userCreateRequestSuccess,
  userDeleteRequestSuccess,
  userUpdateRequestSuccess,
} from '../../../src/interfaces/dtos/user.response.dto';
const tabSize = 40;

describe(padding_left('📦 [USER SERVICE]', tabSize, ' '), () => {
  let module: TestingModule;
  let userService: UserService;
  let ticketService: TicketService;

  beforeAll(async () => {
    //await connection.create();
    module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: `${process.env.JWT_SECRET}`,
        }),
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([UserModel, TicketModel], 'default'),
      ],
      providers: [UserService, TicketService],
    }).compile();

    userService = module.get<UserService>(UserService);
    ticketService = module.get<TicketService>(TicketService);

    const userData = await userService.get_all();
    for (const item of userData) {
      await ticketService.delete_hard_creator(item.uid);
      await userService.delete_hard(item.uid);
    }
  });

  it(
    /*eslint-disable-next-line*/
        padding_left('[SERVICE STATE] 💎 ⇒ ', tabSize, ' ') +
      'Service should be defined',
    () => {
      expect(userService).toBeDefined();
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
        padding_left('[LOGIN SUCCESS] 💾 ⇒ ', tabSize, ' ') + 'Init User. User login successfully',
    async () => {
      const findSpy = jest.spyOn(userService, 'login');
      const dto = UserDTO.from(userMockAdd);
      const result = await userService.insert(dto);
      expect(result).toBe(userCreateRequestSuccess);
      const dataForTest: UserLoginDTO = {
        email: userMockAdd.email,
        password: userMockAdd.password,
      };
      const login = await userService.login(dataForTest);
      expect(findSpy).toHaveBeenCalledWith(dataForTest);
      expect(login.status).toBe(HttpStatus.OK);
      expect(login.token).not.toBeNull();
    },
  );

  it(
    /*eslint-disable-next-line*/
        padding_left('[LOGIN FAILED] 💾 ⇒ ', tabSize, ' ') + 'User login failed',
    async () => {
      const findSpy = jest.spyOn(userService, 'login');
      const dataForTest: UserLoginDTO = {
        email: userMockAdd.email,
        password: userMockEdit.password,
      };
      const login = await userService.login(dataForTest);
      expect(findSpy).toHaveBeenCalledWith(dataForTest);
      expect(login.status).toBe(HttpStatus.FORBIDDEN);
      expect(login.token).toBeNull();
    },
  );

  it(
    /*eslint-disable-next-line*/
        padding_left('[USER UPDATE] 💾 ⇒ ', tabSize, ' ') + 'Update User Information',
    async () => {
      const findSpy = jest.spyOn(userService, 'update');
      const getSample = await userService.get_active();
      expect(getSample.length).toBeGreaterThan(0);
      const sampleUser = getSample[0];
      sampleUser.full_name = userMockEdit.full_name;
      sampleUser.password = userMockEdit.password;
      const dataForTest: UserDTO = UserDTO.from(sampleUser);
      const result = await userService.update(dataForTest);
      expect(findSpy).toHaveBeenCalledWith(dataForTest);
      expect(result.user.full_name).toBe(sampleUser.full_name);
      expect(result).toBe(userUpdateRequestSuccess);
    },
  );

  it(
    /*eslint-disable-next-line*/
        padding_left('[USER SOFT DELETE] 💾 ⇒ ', tabSize, ' ') + 'Soft delete user',
    async () => {
      const findSpy = jest.spyOn(userService, 'delete_soft');
      const dataForTest = await userService.get_active();
      expect(dataForTest.length).toBeGreaterThan(0);
      const result = await userService.delete_soft(dataForTest[0].uid);
      expect(findSpy).toHaveBeenCalledWith(dataForTest[0].uid);
      expect(result).toBe(userDeleteRequestSuccess);
    },
  );

  it(
    /*eslint-disable-next-line*/
        padding_left('[USER HARD DELETE] 💾 ⇒ ', tabSize, ' ') + 'Hard delete user',
    async () => {
      const findSpy = jest.spyOn(userService, 'delete_hard');
      const dataForTest = await userService.get_all();
      expect(dataForTest.length).toBeGreaterThan(0);
      const result = await userService.delete_hard(dataForTest[0].uid);
      expect(findSpy).toHaveBeenCalledWith(dataForTest[0].uid);
      expect(result).toBe(userDeleteRequestSuccess);
    },
  );

  afterAll(async () => {
    const userData = await userService.get_all();
    for (const item of userData) {
      await ticketService.delete_hard_creator(item.uid);
      await userService.delete_hard(item.uid);
    }
    await connection.close();
    //await module.close();
  });
});
