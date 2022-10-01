import { MigrationInterface, QueryRunner } from "typeorm";

export class ActivationCodeAndUser1664572276994 implements MigrationInterface {
    name = 'ActivationCodeAndUser1664572276994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "activation_codes" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying(10) NOT NULL, "userId" integer, CONSTRAINT "REL_c7435d7fca5b757adbfdf5a793" UNIQUE ("userId"), CONSTRAINT "PK_a72dbbeaa882b981dde20ccefc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_roles_enum" AS ENUM('admin', 'editor', 'ghost', 'manager')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying(200) NOT NULL, "lastName" character varying(200) NOT NULL, "userName" character varying(2000), "password" character varying(2000) NOT NULL, "email" character varying(200) NOT NULL, "bio" character varying(4000), "phone" character varying(20), "avatar" character varying(2000), "isActivated" boolean NOT NULL DEFAULT false, "activationLink" character varying(2000), "roles" "public"."users_roles_enum" array NOT NULL DEFAULT '{ghost}', CONSTRAINT "UQ_226bb9aa7aa8a69991209d58f59" UNIQUE ("userName"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "activation_codes" ADD CONSTRAINT "FK_c7435d7fca5b757adbfdf5a793b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activation_codes" DROP CONSTRAINT "FK_c7435d7fca5b757adbfdf5a793b"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
        await queryRunner.query(`DROP TABLE "activation_codes"`);
    }

}
