import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function main() {
  // Clear existing data
  await prisma.$transaction([
    prisma.session.deleteMany(),
    prisma.notifications.deleteMany(),
    prisma.activityLog.deleteMany(),
    prisma.assetLifecycle.deleteMany(),
    prisma.checkInOut.deleteMany(),
    prisma.maintenanceInventory.deleteMany(),
    prisma.maintenance.deleteMany(),
    prisma.inventory.deleteMany(),
    prisma.assetLocationHistory.deleteMany(),
    prisma.asset.deleteMany(),
    prisma.assetType.deleteMany(),
    prisma.location.deleteMany(),
    prisma.user.deleteMany(),
    prisma.employee.deleteMany(),
  ]);

  // Create Employees
  const employees = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.employee.create({
        data: {
          name: faker.person.fullName(),
          department: faker.helpers.arrayElement([
            "Technician",
            "HR",
            "Finance",
            "Customer Support",
            "Marketing",
          ]),
          phone: faker.phone.number(),
          email: faker.internet.email(),
        },
      })
    )
  );

  // Create Users
  const users = await Promise.all(
    Array.from({ length: 15 }).map(async () =>
      prisma.user.create({
        data: {
          username: faker.internet.userName(),
          password: await hashPassword(faker.internet.password()),
          role: faker.helpers.arrayElement(["ADMIN", "INVENTARIS", "TEKNISI"]),
          email: faker.internet.email(),
        },
      })
    )
  );

  // Create Asset Types
  const assetTypes = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.assetType.create({
        data: {
          model: faker.commerce.productName(),
          manufacturer: faker.company.name(),
          category: faker.helpers.arrayElement([
            "Laptop",
            "Desktop",
            "Server",
            "Network Equipment",
            "Printer",
          ]),
          description: faker.lorem.sentence(),
        },
      })
    )
  );

  // Create Locations
  const locations = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.location.create({
        data: {
          name: faker.company.name(),
          address: faker.location.streetAddress(),
          type: faker.helpers.arrayElement(["GUDANG", "KANTOR", "DATA_CENTER"]),
        },
      })
    )
  );

  // Create Assets
  const assets = await Promise.all(
    Array.from({ length: 20 }).map(() => {
      const initialValue = parseFloat(
        faker.commerce.price({ min: 1000, max: 50000 })
      );
      const salvageValue = faker.number.float({
        min: 0,
        max: initialValue * 0.1,
      });
      const usefulLife = faker.number.int({ min: 3, max: 10 });

      return prisma.asset.create({
        data: {
          name: faker.commerce.productName(),
          type_id: faker.helpers.arrayElement(assetTypes).id,
          status: faker.helpers.arrayElement(["AKTIF", "TIDAK_AKTIF", "RUSAK"]),
          purchase_date: faker.date.past(10),
          initial_value: initialValue,
          salvage_value: salvageValue,
          useful_life: usefulLife,
        },
      });
    })
  );

  // Create Asset Location Histories
  await Promise.all(
    assets.map((asset) =>
      prisma.assetLocationHistory.create({
        data: {
          asset_id: asset.id,
          location_id: faker.helpers.arrayElement(locations).id,
          assigned_date: faker.date.past(),
          release_date: Math.random() > 0.5 ? faker.date.recent() : null,
        },
      })
    )
  );

  // Create Inventories
  const inventories = await Promise.all(
    Array.from({ length: 15 }).map(() =>
      prisma.inventory.create({
        data: {
          name: faker.commerce.productName(),
          category: faker.helpers.arrayElement([
            "Tools",
            "Spare Parts",
            "Consumables",
            "Accessories",
          ]),
          quantity: faker.number.int({ min: 1, max: 100 }),
          reorder_level: faker.number.int({ min: 5, max: 20 }),
          unit_price: parseFloat(faker.commerce.price()),
          location_id: faker.helpers.arrayElement(locations).id,
        },
      })
    )
  );

  // Create Maintenances
  const maintenances = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.maintenance.create({
        data: {
          asset_id: faker.helpers.arrayElement(assets).id,
          mechanic_id: faker.helpers.arrayElement(
            users.filter((user) => user.role === "TEKNISI")
          ).id,
          scheduled_date: faker.date.future(),
          status: faker.helpers.arrayElement([
            "DIJADWALKAN",
            "SELESAI",
            "TERTUNDA",
          ]),
          notes: faker.lorem.sentence(),
        },
      })
    )
  );

  // Create Maintenance Inventory Usage
  await Promise.all(
    maintenances.map((maintenance) =>
      prisma.maintenanceInventory.create({
        data: {
          maintenance_id: maintenance.id,
          inventory_id: faker.helpers.arrayElement(inventories).id,
          quantity_used: faker.number.int({ min: 1, max: 5 }),
        },
      })
    )
  );

  // Create Check In/Outs
  await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.checkInOut.create({
        data: {
          asset_id: faker.helpers.arrayElement(assets).id,
          user_id: faker.helpers.arrayElement(users).id,
          employee_id: faker.helpers.arrayElement(employees).id,
          check_out_date: faker.date.past(),
          expected_return_date: faker.date.future(),
          actual_return_date: Math.random() > 0.5 ? faker.date.recent() : null,
          status: faker.helpers.arrayElement([
            "DIPINJAM",
            "DIKEMBALIKAN",
            "JATUH_TEMPO",
          ]),
        },
      })
    )
  );

  // Create Asset Lifecycles
  await Promise.all(
    assets.map((asset) =>
      prisma.assetLifecycle.create({
        data: {
          asset_id: asset.id,
          stage: faker.helpers.arrayElement([
            "BARU",
            "DIGUNAKAN",
            "PERBAIKAN",
            "DIHAPUS",
          ]),
          change_date: faker.date.past(),
          notes: faker.lorem.sentence(),
        },
      })
    )
  );

  // Create Activity Logs
  await Promise.all(
    Array.from({ length: 30 }).map(() =>
      prisma.activityLog.create({
        data: {
          user_id: faker.helpers.arrayElement(users).id,
          action: faker.helpers.arrayElement(["CREATE", "UPDATE", "DELETE"]),
          target_type: faker.helpers.arrayElement([
            "ASSET",
            "INVENTORY",
            "MAINTENANCE",
          ]),
          target_id: faker.number.int({ min: 1, max: 20 }),
        },
      })
    )
  );

  // Create Notifications
  await Promise.all(
    Array.from({ length: 20 }).map(() =>
      prisma.notifications.create({
        data: {
          user_id: faker.helpers.arrayElement(users).id,
          message: faker.lorem.sentence(),
          type: faker.helpers.arrayElement(["PEMELIHARAAN", "STOK_RENDAH"]),
          // is_read: faker.datatype.boolean(),
        },
      })
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
