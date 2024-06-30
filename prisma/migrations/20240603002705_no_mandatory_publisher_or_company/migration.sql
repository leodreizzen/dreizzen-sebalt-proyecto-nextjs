-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "developer_company_fk";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "publisher_company_fk";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "developerId" DROP NOT NULL,
ALTER COLUMN "publisherId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "developer_company_fk" FOREIGN KEY ("developerId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "publisher_company_fk" FOREIGN KEY ("publisherId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
