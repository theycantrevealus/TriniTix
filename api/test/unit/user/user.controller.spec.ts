import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../src/user/user.controller';
import { connection } from '../../../src/providers/database.provider';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../../../src/config/orm.config';
import { UserModel } from '../../../src/model/user.model';
import { UserService } from '../../../src/user/user.service';
import { padding_left } from '../../../utils/string';
const tabSize = 40;
describe(padding_left('📦 [USER CONTROLLER]', tabSize, ' '), () => {
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: `${process.env.JWT_SECRET}`,
        }),
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([UserModel], 'default'),
      ],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it(
    /*eslint-disable-next-line*/
      padding_left('[CONTROLLER STATE] 💎 ⇒ ', tabSize, ' ') + 'Controller should be defined',
    async () => {
      expect(userController).toBeDefined();
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
