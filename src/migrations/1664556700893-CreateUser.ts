import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1664556700893 implements MigrationInterface {
    name = 'CreateUser1664556700893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "articles" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(200) NOT NULL, "slug" character varying NOT NULL, "description" character varying(4000) NOT NULL DEFAULT '', "image" character varying NOT NULL DEFAULT '', "viewsCount" integer NOT NULL DEFAULT '0', "favoritesCount" integer NOT NULL DEFAULT '0', "isBlock" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_roles_enum" AS ENUM('admin', 'editor', 'ghost', 'manager')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying(200) NOT NULL, "lastName" character varying(200) NOT NULL, "userName" character varying(2000), "password" character varying(2000) NOT NULL, "email" character varying(200) NOT NULL, "bio" character varying(4000), "phone" character varying(20), "avatar" character varying(2000), "isActivated" boolean NOT NULL DEFAULT false, "activationLink" character varying(2000), "roles" "public"."users_roles_enum" array NOT NULL DEFAULT '{ghost}', CONSTRAINT "UQ_226bb9aa7aa8a69991209d58f59" UNIQUE ("userName"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activation_codes" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying(10) NOT NULL, CONSTRAINT "PK_a72dbbeaa882b981dde20ccefc9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "activation_codes"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
        await queryRunner.query(`DROP TABLE "articles"`);
    }

}
