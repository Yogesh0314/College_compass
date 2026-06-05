import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'
import "dotenv/config";

const connectionString = process.env.DATABASE_URL
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Cleaning database...');
  await prisma.course.deleteMany();
  await prisma.review.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  const colleges = [
    {
      name: "Kolhapur Institute of Technology's College of Engineering (KIT)",
      description: "One of the premier engineering institutes in Kolhapur, known for its strong academic foundation and excellent placement records.",
      location: "Gokul Shirgaon, Kolhapur",
      fees: 110000,
      rating: 4.5,
      placementRate: 85,
      image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000",
      courses: [
        { name: "Computer Science and Engineering", duration: "4 Years", fees: 110000 },
        { name: "Mechanical Engineering", duration: "4 Years", fees: 110000 }
      ]
    },
    {
      name: "D.Y. Patil College of Engineering and Technology",
      description: "A well-established institution offering a wide range of engineering programs with state-of-the-art infrastructure.",
      location: "Kasaba Bawada, Kolhapur",
      fees: 105000,
      rating: 4.2,
      placementRate: 80,
      image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1000",
      courses: [
        { name: "Computer Science", duration: "4 Years", fees: 105000 },
        { name: "Chemical Engineering", duration: "4 Years", fees: 105000 }
      ]
    },
    {
      name: "Shivaji University, Department of Technology",
      description: "The university's own department of technology offering high-quality education and research opportunities.",
      location: "Vidyanagar, Kolhapur",
      fees: 85000,
      rating: 4.0,
      placementRate: 75,
      image: "https://images.unsplash.com/photo-1523050335456-adabbf72c766?q=80&w=1000",
      courses: [
        { name: "Computer Science and Technology", duration: "4 Years", fees: 85000 },
        { name: "Food Technology", duration: "4 Years", fees: 85000 }
      ]
    },
    {
      name: "College of Engineering, Pune (COEP)",
      description: "One of the oldest and most prestigious engineering colleges in Asia, known for its rigorous academics and stellar placements.",
      location: "Shivajinagar, Pune",
      fees: 90000,
      rating: 4.9,
      placementRate: 98,
      image: "https://images.unsplash.com/photo-1607237138185-efd9571f9f90?q=80&w=1000",
      courses: [
        { name: "Computer Engineering", duration: "4 Years", fees: 90000 },
        { name: "Electronics and Telecommunication", duration: "4 Years", fees: 90000 }
      ]
    },
    {
      name: "Pune Institute of Computer Technology (PICT)",
      description: "A top-tier private college in Pune, highly sought after for its Computer and IT programs.",
      location: "Dhankawadi, Pune",
      fees: 95000,
      rating: 4.7,
      placementRate: 92,
      image: "https://images.unsplash.com/photo-1525921429624-479b6a29d840?q=80&w=1000",
      courses: [
        { name: "Computer Engineering", duration: "4 Years", fees: 95000 },
        { name: "Information Technology", duration: "4 Years", fees: 95000 }
      ]
    },
    {
      name: "Vishwakarma Institute of Technology (VIT)",
      description: "A leading autonomous engineering institute in Pune with excellent industry tie-ups.",
      location: "Bibwewadi, Pune",
      fees: 165000,
      rating: 4.5,
      placementRate: 88,
      image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1000",
      courses: [
        { name: "Computer Engineering", duration: "4 Years", fees: 165000 },
        { name: "Mechanical Engineering", duration: "4 Years", fees: 165000 }
      ]
    },
    {
      name: "Veermata Jijabai Technological Institute (VJTI)",
      description: "A premier institute in Mumbai known for its strong alumni network and excellence in technical education.",
      location: "Matunga, Mumbai",
      fees: 85000,
      rating: 4.8,
      placementRate: 95,
      image: "https://images.unsplash.com/photo-1541829070764-84a7d30dee62?q=80&w=1000",
      courses: [
        { name: "Information Technology", duration: "4 Years", fees: 85000 },
        { name: "Computer Engineering", duration: "4 Years", fees: 85000 }
      ]
    },
    {
      name: "Sardar Patel Institute of Technology (SPIT)",
      description: "A top private engineering college in Mumbai known for high academic standards and placements.",
      location: "Andheri, Mumbai",
      fees: 170000,
      rating: 4.6,
      placementRate: 93,
      image: "https://images.unsplash.com/photo-1498243639359-2818a7768227?q=80&w=1000",
      courses: [
        { name: "Computer Engineering", duration: "4 Years", fees: 170000 },
        { name: "Data Science", duration: "4 Years", fees: 170000 }
      ]
    },
    {
      name: "Walchand College of Engineering",
      description: "A prestigious government-aided autonomous institute in Sangli with a rich history of technical excellence.",
      location: "Vishrambag, Sangli",
      fees: 85000,
      rating: 4.7,
      placementRate: 90,
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000",
      courses: [
        { name: "Computer Science", duration: "4 Years", fees: 85000 },
        { name: "Information Technology", duration: "4 Years", fees: 85000 }
      ]
    },
    {
      name: "National Institute of Technology Karnataka (NITK)",
      description: "A premier technical university in India located on a beautiful beach-side campus in Surathkal.",
      location: "Surathkal, Karnataka",
      fees: 150000,
      rating: 4.9,
      placementRate: 96,
      image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1000",
      courses: [
        { name: "Computer Science", duration: "4 Years", fees: 150000 },
        { name: "Information Technology", duration: "4 Years", fees: 150000 }
      ]
    }
  ];

  console.log('Start seeding...');

  for (const c of colleges) {
    const college = await prisma.college.create({
      data: {
        name: c.name,
        description: c.description,
        location: c.location,
        fees: c.fees,
        rating: c.rating,
        placementRate: c.placementRate,
        image: c.image,
        courses: {
          create: c.courses
        }
      }
    });
    console.log(`Created college with id: ${college.id}`);
  }

  const hashedPassword = await bcrypt.hash('student123', 10);
  await prisma.user.create({
    data: {
      name: "Test Student",
      email: "student@example.com",
      password: hashedPassword
    }
  });
  console.log('Created test user: student@example.com / student123');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
