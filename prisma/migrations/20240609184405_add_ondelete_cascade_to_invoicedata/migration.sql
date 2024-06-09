-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_invoiceDataId_fkey";

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_invoiceDataId_fkey" FOREIGN KEY ("invoiceDataId") REFERENCES "InvoiceData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
