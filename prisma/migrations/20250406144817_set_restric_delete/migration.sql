-- DropForeignKey
ALTER TABLE "check_in_outs" DROP CONSTRAINT "check_in_outs_asset_id_fkey";

-- AddForeignKey
ALTER TABLE "check_in_outs" ADD CONSTRAINT "check_in_outs_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
