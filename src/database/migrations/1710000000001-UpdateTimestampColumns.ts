import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTimestampColumns1710000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Actualizar columnas de chat
    await queryRunner.query(`
      ALTER TABLE "chat"
      ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE,
      ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE
    `);

    // Actualizar columnas de message
    await queryRunner.query(`
      ALTER TABLE "message"
      ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir cambios en chat
    await queryRunner.query(`
      ALTER TABLE "chat"
      ALTER COLUMN "createdAt" TYPE TIMESTAMP,
      ALTER COLUMN "updatedAt" TYPE TIMESTAMP
    `);

    // Revertir cambios en message
    await queryRunner.query(`
      ALTER TABLE "message"
      ALTER COLUMN "createdAt" TYPE TIMESTAMP
    `);
  }
}
