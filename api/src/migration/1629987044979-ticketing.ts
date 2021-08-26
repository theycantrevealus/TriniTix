import {MigrationInterface, QueryRunner} from "typeorm";

export class ticketing1629987044979 implements MigrationInterface {
    name = 'ticketing1629987044979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ticket_status" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_6fdddb72b498b105f48103c2eed" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "ticket_status"`);
    }

}
