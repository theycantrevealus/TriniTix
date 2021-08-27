import { Test, TestingModule } from '@nestjs/testing';
import { StatusController } from '../../../../src/status/status.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../../../../src/config/orm.config';
import { StatusService } from '../../../../src/status/status.service';
import { connection } from '../../../../src/providers/database.provider';
import { UserService } from '../../../../src/user/user.service';
import { TicketStatusModel } from '../../../../src/model/ticket.status.model';
import { UserModel } from '../../../../src/model/user.model';

describe('StatusController', () => {
  let controller: StatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: `${process.env.JWT_SECRET}`,
        }),
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([TicketStatusModel, UserModel], 'default'),
      ],
      controllers: [StatusController],
      providers: [StatusService, UserService],
    }).compile();

    controller = module.get<StatusController>(StatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterAll(async () => {
    /*const userData = await service.user_all();
    for (const item of userData) {
      await service.user_delete_hard(item.uid);
    }*/
    await connection.close();
    //await module.close();
  });
});
