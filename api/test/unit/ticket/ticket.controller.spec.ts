import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from '../../../src/ticket/ticket.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../../../src/config/orm.config';
import { UserModel } from '../../../src/model/user.model';
import { connection } from '../../../src/providers/database.provider';
import { UserService } from '../../../src/user/user.service';
import { TicketService } from '../../../src/ticket/ticket.service';
import { TicketModel } from '../../../src/model/ticket.model';
import { StatusService } from '../../../src/status/status.service';
import { TicketStatusModel } from '../../../src/model/ticket.status.model';
import { padding_left } from '../../../utils/string';
const tabSize = 40;
describe('TicketController', () => {
  let controller: TicketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: `${process.env.JWT_SECRET}`,
        }),
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature(
          [UserModel, TicketModel, TicketStatusModel],
          'default',
        ),
      ],
      controllers: [TicketController],
      providers: [UserService, TicketService, StatusService],
    }).compile();

    controller = module.get<TicketController>(TicketController);
  });

  it(
    /*eslint-disable-next-line*/
      padding_left('[TICKET CONTROLLER] 💾 ⇒ ', tabSize, ' ') + 'Controller should be defined',
    async () => {
      expect(controller).toBeDefined();
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
});
