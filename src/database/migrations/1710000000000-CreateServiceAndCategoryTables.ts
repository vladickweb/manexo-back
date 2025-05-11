import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateServiceAndCategoryTables1710000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla de categorías
    await queryRunner.query(`
      CREATE TABLE "category" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying NOT NULL,
        "description" character varying,
        "icon" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Crear tabla de servicios
    await queryRunner.query(`
      CREATE TABLE "service" (
        "id" SERIAL PRIMARY KEY,
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "location" json NOT NULL,
        "price" decimal(10,2) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "isActive" boolean NOT NULL DEFAULT true,
        "userId" integer NOT NULL,
        "categoryId" integer NOT NULL,
        CONSTRAINT "FK_service_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_service_category" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "service"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
