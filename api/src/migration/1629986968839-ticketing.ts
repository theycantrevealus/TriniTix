import {MigrationInterface, QueryRunner} from "typeorm";

export class ticketing1629986968839 implements MigrationInterface {
    name = 'ticketing1629986968839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ticket" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "title" character varying NOT NULL, "content" text, "creator" uuid NOT NULL, "status" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "creatorUid" uuid, CONSTRAINT "PK_535a66eab2c059a0b0aff317f9d" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "full_name"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "full_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_f2698b038584b8d15b6387d2c9c" FOREIGN KEY ("creatorUid") REFERENCES "user"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_f2698b038584b8d15b6387d2c9c"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "full_name"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "full_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "ticket"`);
    }

}
