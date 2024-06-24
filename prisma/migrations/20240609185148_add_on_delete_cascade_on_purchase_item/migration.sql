-- DropForeignKey
ALTER TABLE "PurchaseItem" DROP CONSTRAINT "PurchaseItem_purchaseId_fkey";

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
