# College Compass – Setup Instructions

College Compass is a modern web platform to help students discover, compare, and save engineering colleges in the Kolhapur region.

## Tech Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL (configured for local/cloud)
- **Auth:** JWT-based manual authentication

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A PostgreSQL database instance

## Getting Started

1. **Navigate to the project folder:**
   ```bash
   cd college-compass
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `college-compass` root (see `.env.example`):
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/college_compass"
   JWT_SECRET="your-secret-key"
   ```

4. **Initialize Database:**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Seed the Database (Kolhapur Engineering Colleges):**
   ```bash
   npx prisma db seed
   ```

6. **Run the Development Server:**
   ```bash
   npm run dev
   ```

7. **Open the App:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features Implemented
- **Home Page:** Hero search and featured colleges.
- **Colleges Listing:** Search and filters (Location, Fees, Rating).
- **College Details:** Dynamic pages with Overview, Courses, Placements, and Reviews.
- **Comparison Tool:** Side-by-side comparison for up to 3 colleges.
- **Authentication:** Secure Login/Register system.
- **Saved Colleges:** Bookmarking feature for logged-in users.
