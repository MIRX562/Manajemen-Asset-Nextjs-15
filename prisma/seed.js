import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hashPassword(password) {
  const saltRounds = 10; // This is the cost factor for bcrypt
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
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
  const employees = [];
  for (let i = 0; i < 10; i++) {
    const employee = await prisma.employee.create({
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
    });
    employees.push(employee);
  }

  // Create Users
  const users = [];
  for (let i = 0; i < 15; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.userName(),
        password: await hashPassword(faker.internet.password()),
        role: faker.helpers.arrayElement(["ADMIN", "INVENTARIS", "TEKNISI"]),
        email: faker.internet.email(),
        employee_id: i < 10 ? employees[i].id : null,
      },
    });
    users.push(user);
  }

  // Create Asset Types
  const assetTypes = [];
  const categories = [
    "Laptop",
    "Desktop",
    "Server",
    "Network Equipment",
    "Printer",
  ];
  for (let i = 0; i < 10; i++) {
    const assetType = await prisma.assetType.create({
      data: {
        model: faker.commerce.productName(),
        manufacturer: faker.company.name(),
        category: faker.helpers.arrayElement(categories),
        description: faker.lorem.sentence(),
      },
    });
    assetTypes.push(assetType);
  }

  // Create Locations
  const locations = [];
  for (let i = 0; i < 5; i++) {
    const location = await prisma.location.create({
      data: {
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        type: faker.helpers.arrayElement(["GUDANG", "KANTOR", "DATA_CENTER"]),
      },
    });
    locations.push(location);
  }

  // Create Assets
  const assets = [];
  for (let i = 0; i < 20; i++) {
    const initialValue = parseFloat(
      faker.commerce.price({ min: 1000, max: 50000 })
    ); // Example range for initial value
    const salvageValue = faker.number.float({
      min: 0,
      max: initialValue * 0.1,
    }); // Salvage value up to 10% of the initial value
    const usefulLife = faker.number.int({ min: 3, max: 10 }); // Useful life in years

    const asset = await prisma.asset.create({
      data: {
        name: faker.commerce.productName(),
        type_id: faker.helpers.arrayElement(assetTypes).id,
        status: faker.helpers.arrayElement(["AKTIF", "TIDAK_AKTIF", "RUSAK"]),
        purchase_date: faker.date.past(10), // Purchased up to 10 years ago
        lifecycle_stage: faker.helpers.arrayElement([
          "BARU",
          "DIGUNAKAN",
          "PERBAIKAN",
          "DIHAPUS",
        ]),
        initial_value: initialValue,
        salvage_value: salvageValue,
        useful_life: usefulLife,
      },
    });
    assets.push(asset);
  }

  // Create Asset Location Histories
  for (const asset of assets) {
    await prisma.assetLocationHistory.create({
      data: {
        asset_id: asset.id,
        location_id: faker.helpers.arrayElement(locations).id,
        assigned_date: faker.date.past(),
        release_date: Math.random() > 0.5 ? faker.date.recent() : null,
      },
    });
  }

  // Create Inventories
  const inventories = [];
  for (let i = 0; i < 15; i++) {
    const inventory = await prisma.inventory.create({
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
    });
    inventories.push(inventory);
  }

  // Create Maintenances
  const maintenances = [];
  const technicians = users.filter((user) => user.role === "TEKNISI");
  for (let i = 0; i < technicians.length; i++) {
    const maintenance = await prisma.maintenance.create({
      data: {
        asset_id: faker.helpers.arrayElement(assets).id,
        mechanic_id: technicians[i].id,
        scheduled_date: faker.date.future(),
        status: faker.helpers.arrayElement([
          "DIJADWALKAN",
          "SELESAI",
          "TERTUNDA",
        ]),
        notes: faker.lorem.sentence(),
      },
    });
    maintenances.push(maintenance);
  }

  // Create Maintenance Inventory Usage
  for (const maintenance of maintenances) {
    await prisma.maintenanceInventory.create({
      data: {
        maintenance_id: maintenance.id,
        inventory_id: faker.helpers.arrayElement(inventories).id,
        quantity_used: faker.number.int({ min: 1, max: 5 }),
      },
    });
  }

  // Create Check In/Outs
  for (let i = 0; i < 10; i++) {
    await prisma.checkInOut.create({
      data: {
        asset_id: faker.helpers.arrayElement(assets).id,
        user_id: faker.helpers.arrayElement(users).id,
        check_out_date: faker.date.past(),
        expected_return_date: faker.date.future(),
        actual_return_date: Math.random() > 0.5 ? faker.date.recent() : null,
        status: faker.helpers.arrayElement(["DIPINJAM", "DIKEMBALIKAN"]),
      },
    });
  }

  // Create Asset Lifecycles
  for (const asset of assets) {
    await prisma.assetLifecycle.create({
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
    });
  }

  // Create Activity Logs
  for (let i = 0; i < 30; i++) {
    await prisma.activityLog.create({
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
    });
  }

  // Create Notifications
  for (let i = 0; i < 20; i++) {
    await prisma.notifications.create({
      data: {
        user_id: faker.helpers.arrayElement(users).id,
        message: faker.lorem.sentence(),
        type: faker.helpers.arrayElement([
          "PEMELIHARAAN",
          "STOK_RENDAH",
          "CHECKOUT_TERLAMBAT",
          "STATUS_ASET",
        ]),
        is_read: faker.datatype.boolean(),
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
