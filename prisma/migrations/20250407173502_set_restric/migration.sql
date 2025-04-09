-- DropForeignKey
ALTER TABLE "inventories" DROP CONSTRAINT "inventories_location_id_fkey";

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
