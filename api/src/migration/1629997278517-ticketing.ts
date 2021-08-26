import {MigrationInterface, QueryRunner} from "typeorm";

export class ticketing1629997278517 implements MigrationInterface {
    name = 'ticketing1629997278517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."ticket_status" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."ticket_status" ALTER COLUMN "updated_at" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."ticket_status" ALTER COLUMN "updated_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."ticket_status" ALTER COLUMN "created_at" DROP NOT NULL`);
    }

}
