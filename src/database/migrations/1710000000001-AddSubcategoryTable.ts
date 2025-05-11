import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSubcategoryTable1710000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla de subcategorías
    await queryRunner.query(`
      CREATE TABLE "subcategory" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying NOT NULL,
        "description" character varying,
        "icon" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "categoryId" integer NOT NULL,
        CONSTRAINT "FK_subcategory_category" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE
      )
    `);

    // Agregar columna subcategoryId a la tabla de servicios
    await queryRunner.query(`
      ALTER TABLE "service" ADD COLUMN "subcategoryId" integer,
      ADD CONSTRAINT "FK_service_subcategory" FOREIGN KEY ("subcategoryId") REFERENCES "subcategory"("id") ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar la restricción y columna de subcategoría en servicios
    await queryRunner.query(`
      ALTER TABLE "service" DROP CONSTRAINT "FK_service_subcategory",
      DROP COLUMN "subcategoryId"
    `);

    // Eliminar tabla de subcategorías
    await queryRunner.query(`DROP TABLE "subcategory"`);
  }
}
