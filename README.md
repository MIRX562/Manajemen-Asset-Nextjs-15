# Asset Management System

A comprehensive asset management system built with Next.js 14, featuring role-based access control, real-time notifications, and detailed asset tracking capabilities.

## Features

- 🔐 **Role-Based Access Control (RBAC)**: Different access levels for Admin, Inventaris, Teknisi, and Employee roles
- 📊 **Dashboard Analytics**: Real-time insights into asset usage and maintenance
- 🏢 **Location Management**: Track assets across different locations
- 🔧 **Maintenance Tracking**: Schedule and monitor maintenance tasks
- 📝 **Check In/Out System**: Manage asset assignments and returns
- 📱 **Responsive Design**: Full mobile and desktop support
- 🔔 **Real-time Notifications**: Instant updates on asset-related activities
- 📈 **Reports Generation**: Comprehensive reporting system
- 🗃️ **Asset Type Management**: Organize assets by categories
- 👥 **User & Employee Management**: Complete user lifecycle management

## Requirements

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- npm, yarn, pnpm, or bun

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/MIRX562/am-kp.git
cd am-kp
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Using yarn:

```bash
yarn install
```

Using pnpm:

```bash
pnpm install
```

Using bun:

```bash
bun install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/asset_management # if using docker
#DATABASE_URL=your_postgresql_connection_string # if not using docker

# Other Settings
NODE_ENV="development" # or "production"
```

### 4. Database Setup

Initialize the database and run migrations:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### 5. Running the Application

Development mode:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Production build:

```bash
# Build the application
npm run build
# or
yarn build
# or
pnpm build
# or
bun run build

# Start the production server
npm start
# or
yarn start
# or
pnpm start
# or
bun start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### 6. Default Login

If you don't seed the database, at login you will be prompted to register the first user yourself which will have admin authority.

If you seed the database, you can use these default credentials:

```
Admin User:
Email: admin@example.com
Password: Admin@123

Inventaris User:
Email: inventaris@example.com
Password: Inventaris@123

Teknisi User:
Email: teknisi@example.com
Password: Teknisi@123
```

## Additional Information

### Running with Docker

```bash
# Build and start containers
docker-compose up -d

# Stop containers
docker-compose down
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio
- `npx prisma generate` - Generate prisma client
- `npx prisma migrate dev` - Making migration (automatically push and seed the db)
- `npx prisma db push` - Push Schema to DB without making migration
- `npx prisma db seed` - Seed database

### Project Structure

- `/src/app` - Next.js 14 app router pages
- `/src/components` - Reusable React components
- `/src/actions` - Server actions for data mutations
- `/src/lib` - Utility functions and configurations
- `/prisma` - Database schema and migrations
- `/public` - Static assets

## Troubleshooting

1. **Database Connection Issues**

   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env
   - Ensure database exists

2. **Build Errors**

   - Clear `.next` folder
   - Delete `node_modules` and reinstall dependencies
   - Verify Node.js version
