import { padding_left } from '../../utils/string';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../../src/config/orm.config';
import { UserModel } from '../../src/model/user.model';
import { getConnection } from 'typeorm';
import { UserDTO } from '../../src/interfaces/dtos/user.dto';
import { userMockAdd, userMockEdit } from './mocks/user.mock';
import { userCreateRequestSuccess } from '../../src/interfaces/dtos/user.add.response.dto';
import 'jest-extended';
import { HttpStatus } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { connection } from '../../src/providers/database.provider';
const tabSize = 40;

describe(
  padding_left('📦 [USER TRANSACTION SERVICE]', tabSize / 2, ' '),
  () => {
    let module: TestingModule;
    let service: UserService;

    beforeAll(async () => {
      //await connection.create();
      module = await Test.createTestingModule({
        imports: [
          JwtModule.register({
            secret: `${process.env.JWT_SECRET}`,
          }),
          TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
          TypeOrmModule.forFeature([UserModel], 'default'),
        ],
        providers: [UserService],
      }).compile();

      service = module.get<UserService>(UserService);
      const userData = await service.user_all();
      for (const item of userData) {
        await service.user_delete_hard(item.uid);
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
            padding_left('[CONNECTION STATE] 📀 ⇒ ', tabSize, ' ') + 'DB connection must be established',
      () => {
        expect(getConnection().isConnected).toBeTrue();
      },
    );

    /*it(
      /!*eslint-disable-next-line*!/
          padding_left('[DELETE SOFT] 💾 ⇒ ', tabSize, ' ') + 'Soft delete user',
      async () => {
        const findUserSpy = jest.spyOn(service, 'user_delete_soft');
        const sampleUser = await service.user_all();
        expect(sampleUser).toBeArray();
        expect(sampleUser.length).toBeGreaterThan(0);
        const userResult = await service.user_delete_soft(sampleUser[0].uid);
        expect(findUserSpy).toHaveBeenCalled();
        expect(userResult).toBe(userDeleteRequestSuccess);
      },
    );*/

    it(
      /*eslint-disable-next-line*/
        padding_left('[LOGIN SUCCESS] 💾 ⇒ ', tabSize, ' ') + 'User login successfully',
      async () => {
        const userServiceSpy = jest.spyOn(service, 'login');
        const dto = UserDTO.from(userMockAdd);
        const userResult = await service.user_add(dto);
        expect(userResult).toBe(userCreateRequestSuccess);
        const login = await service.login({
          email: userMockAdd.email,
          password: userMockAdd.password,
        });
        expect(userServiceSpy).toHaveBeenCalled();
        expect(login.status).toBe(HttpStatus.OK);
        expect(login.data.token).not.toBeNull();
      },
    );

    it(
      /*eslint-disable-next-line*/
        padding_left('[LOGIN FAILED] 💾 ⇒ ', tabSize, ' ') + 'User login failed',
      async () => {
        const userServiceSpy = jest.spyOn(service, 'login');
        const login = await service.login({
          email: userMockAdd.email,
          password: userMockEdit.password,
        });
        expect(userServiceSpy).toHaveBeenCalled();
        expect(login.status).toBe(HttpStatus.FORBIDDEN);
        expect(login.data.token).toBeNull();
      },
    );

    afterAll(async () => {
      /*const userData = await service.user_all();
      for (const item of userData) {
        await service.user_delete_hard(item.uid);
      }*/
      await connection.close();
      //await module.close();
    });
  },
);
