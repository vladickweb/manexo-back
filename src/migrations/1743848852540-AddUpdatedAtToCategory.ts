import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUpdatedAtToCategory1743848852540 implements MigrationInterface {
  name = 'AddUpdatedAtToCategory1743848852540';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "updatedAt"`);
  }
}
