-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'INVENTARIS', 'TEKNISI');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('AKTIF', 'TIDAK_AKTIF', 'RUSAK');

-- CreateEnum
CREATE TYPE "LifecycleStage" AS ENUM ('BARU', 'DIGUNAKAN', 'PERBAIKAN', 'DIHAPUS');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('GUDANG', 'KANTOR', 'DATA_CENTER');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('DIJADWALKAN', 'SELESAI', 'TERTUNDA');

-- CreateEnum
CREATE TYPE "CheckInOutStatus" AS ENUM ('DIPINJAM', 'DIKEMBALIKAN');

-- CreateEnum
CREATE TYPE "TargetType" AS ENUM ('ASSET', 'INVENTORY', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('PEMELIHARAAN', 'STOK_RENDAH', 'CHECKOUT_TERLAMBAT', 'STATUS_ASET');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employee_id" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type_id" INTEGER NOT NULL,
    "status" "AssetStatus" NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL,
    "lifecycle_stage" "LifecycleStage" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_types" (
    "id" SERIAL NOT NULL,
    "model" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "asset_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "type" "LocationType" NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_location_histories" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "location_id" INTEGER NOT NULL,
    "assigned_date" TIMESTAMP(3) NOT NULL,
    "release_date" TIMESTAMP(3),

    CONSTRAINT "asset_location_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reorder_level" INTEGER NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "location_id" INTEGER,

    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenances" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "mechanic_id" INTEGER NOT NULL,
    "scheduled_date" TIMESTAMP(3) NOT NULL,
    "status" "MaintenanceStatus" NOT NULL,
    "notes" TEXT,

    CONSTRAINT "maintenances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_inventories" (
    "maintenance_inventory_id" SERIAL NOT NULL,
    "maintenance_id" INTEGER NOT NULL,
    "inventory_id" INTEGER NOT NULL,
    "quantity_used" INTEGER NOT NULL,

    CONSTRAINT "maintenance_inventories_pkey" PRIMARY KEY ("maintenance_inventory_id")
);

-- CreateTable
CREATE TABLE "check_in_outs" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "check_out_date" TIMESTAMP(3) NOT NULL,
    "expected_return_date" TIMESTAMP(3) NOT NULL,
    "actual_return_date" TIMESTAMP(3),
    "status" "CheckInOutStatus" NOT NULL,

    CONSTRAINT "check_in_outs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_lifecycles" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "stage" "LifecycleStage" NOT NULL,
    "change_date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "asset_lifecycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "target_type" "TargetType" NOT NULL,
    "target_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_employee_id_key" ON "users"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE INDEX "asset_location_histories_asset_id_location_id_idx" ON "asset_location_histories"("asset_id", "location_id");

-- CreateIndex
CREATE UNIQUE INDEX "maintenances_mechanic_id_key" ON "maintenances"("mechanic_id");

-- CreateIndex
CREATE INDEX "maintenances_asset_id_mechanic_id_idx" ON "maintenances"("asset_id", "mechanic_id");

-- CreateIndex
CREATE INDEX "maintenance_inventories_maintenance_id_inventory_id_idx" ON "maintenance_inventories"("maintenance_id", "inventory_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "asset_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_location_histories" ADD CONSTRAINT "asset_location_histories_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_location_histories" ADD CONSTRAINT "asset_location_histories_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_mechanic_id_fkey" FOREIGN KEY ("mechanic_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_inventories" ADD CONSTRAINT "maintenance_inventories_maintenance_id_fkey" FOREIGN KEY ("maintenance_id") REFERENCES "maintenances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_inventories" ADD CONSTRAINT "maintenance_inventories_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_in_outs" ADD CONSTRAINT "check_in_outs_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_in_outs" ADD CONSTRAINT "check_in_outs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_lifecycles" ADD CONSTRAINT "asset_lifecycles_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
