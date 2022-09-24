import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1664002259690 implements MigrationInterface {
    name = 'CreateUser1664002259690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'ghost', 'manager', 'editor')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying(200) NOT NULL, "lastName" character varying(200) NOT NULL, "userName" character varying(2000), "password" character varying(2000) NOT NULL, "email" character varying(200) NOT NULL, "bio" character varying(4000), "phone" character varying(20), "avatar" character varying(2000), "isActivated" boolean NOT NULL DEFAULT false, "activationLink" character varying(2000), "role" "public"."users_role_enum" NOT NULL DEFAULT 'ghost', CONSTRAINT "UQ_226bb9aa7aa8a69991209d58f59" UNIQUE ("userName"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
