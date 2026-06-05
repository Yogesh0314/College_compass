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
      image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
      courses: [
        { name: "Computer Science and Engineering", duration: "4 Years", fees: 110000 },
        { name: "Mechanical Engineering", duration: "4 Years", fees: 110000 },
        { name: "Electronics and Telecommunication", duration: "4 Years", fees: 110000 },
        { name: "Civil Engineering", duration: "4 Years", fees: 110000 }
      ]
    },
    {
      name: "D.Y. Patil College of Engineering and Technology",
      description: "A well-established institution offering a wide range of engineering programs with state-of-the-art infrastructure.",
      location: "Kasaba Bawada, Kolhapur",
      fees: 105000,
      rating: 4.2,
      placementRate: 80,
      image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
      courses: [
        { name: "Computer Science", duration: "4 Years", fees: 105000 },
        { name: "Chemical Engineering", duration: "4 Years", fees: 105000 },
        { name: "Mechanical Engineering", duration: "4 Years", fees: 105000 },
        { name: "Architecture", duration: "5 Years", fees: 120000 }
      ]
    },
    {
      name: "Shivaji University, Department of Technology",
      description: "The university's own department of technology offering high-quality education and research opportunities.",
      location: "Vidyanagar, Kolhapur",
      fees: 85000,
      rating: 4.0,
      placementRate: 75,
      image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Shivaji_University_Main_Building.jpg",
      courses: [
        { name: "Computer Science and Technology", duration: "4 Years", fees: 85000 },
        { name: "Food Technology", duration: "4 Years", fees: 85000 },
        { name: "Electronics Engineering", duration: "4 Years", fees: 85000 }
      ]
    },
    {
      name: "Bharati Vidyapeeth's College of Engineering",
      description: "A prominent engineering college in Kolhapur focusing on holistic development and industry readiness.",
      location: "Morewadi, Kolhapur",
      fees: 95000,
      rating: 4.1,
      placementRate: 78,
      image: "https://images.unsplash.com/photo-1523050335456-adabbf72c766?auto=format&fit=crop&q=80&w=800",
      courses: [
        { name: "Information Technology", duration: "4 Years", fees: 95000 },
        { name: "Computer Science", duration: "4 Years", fees: 95000 },
        { name: "Electronics", duration: "4 Years", fees: 95000 }
      ]
    },
    {
      name: "College of Engineering, Pune (COEP)",
      description: "One of the oldest and most prestigious engineering colleges in Asia, known for its rigorous academics and stellar placements.",
      location: "Shivajinagar, Pune",
      fees: 90000,
      rating: 4.9,
      placementRate: 98,
      image: "https://upload.wikimedia.org/wikipedia/commons/6/60/COEP_Main_Building.jpg",
      courses: [
        { name: "Computer Engineering", duration: "4 Years", fees: 90000 },
        { name: "Electronics and Telecommunication", duration: "4 Years", fees: 90000 },
        { name: "Mechanical Engineering", duration: "4 Years", fees: 90000 }
      ]
    },
    {
      name: "Pune Institute of Computer Technology (PICT)",
      description: "A top-tier private college in Pune, highly sought after for its Computer and IT programs.",
      location: "Dhankawadi, Pune",
      fees: 95000,
      rating: 4.7,
      placementRate: 92,
      image: "https://upload.wikimedia.org/wikipedia/commons/e/ec/PICT_Main_Building.jpg",
      courses: [
        { name: "Computer Engineering", duration: "4 Years", fees: 95000 },
        { name: "Information Technology", duration: "4 Years", fees: 95000 },
        { name: "Electronics and Telecommunication", duration: "4 Years", fees: 95000 }
      ]
    },
    {
      name: "Vishwakarma Institute of Technology (VIT)",
      description: "A leading autonomous engineering institute in Pune with excellent industry tie-ups.",
      location: "Bibwewadi, Pune",
      fees: 165000,
      rating: 4.5,
      placementRate: 88,
      image: "https://upload.wikimedia.org/wikipedia/commons/b/b3/VIT_Pune_102.jpg",
      courses: [
        { name: "Computer Engineering", duration: "4 Years", fees: 165000 },
        { name: "Mechanical Engineering", duration: "4 Years", fees: 165000 },
        { name: "Chemical Engineering", duration: "4 Years", fees: 165000 }
      ]
    },
    {
      name: "Maharashtra Institute of Technology (MIT-WPU)",
      description: "A world-class university in Pune offering a holistic approach to engineering education.",
      location: "Kothrud, Pune",
      fees: 310000,
      rating: 4.4,
      placementRate: 85,
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
      courses: [
        { name: "Computer Science and Engineering", duration: "4 Years", fees: 310000 },
        { name: "Robotics and Automation", duration: "4 Years", fees: 310000 },
        { name: "Civil Engineering", duration: "4 Years", fees: 310000 }
      ]
    },
    {
      name: "Cummins College of Engineering for Women",
      description: "A premier women-only engineering college in Pune, highly respected by top recruiters.",
      location: "Karve Nagar, Pune",
      fees: 180000,
      rating: 4.6,
      placementRate: 90,
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Cummins_Main_Building.jpg",
      courses: [
        { name: "Computer Engineering", duration: "4 Years", fees: 180000 },
        { name: "Instrumentation and Control", duration: "4 Years", fees: 180000 },
        { name: "Information Technology", duration: "4 Years", fees: 180000 }
      ]
    },
    {
      name: "Veermata Jijabai Technological Institute (VJTI)",
      description: "A premier institute in Mumbai known for its strong alumni network and excellence in technical education.",
      location: "Matunga, Mumbai",
      fees: 85000,
      rating: 4.8,
      placementRate: 95,
      image: "https://upload.wikimedia.org/wikipedia/commons/5/5c/VJTI_Quadrangle.jpg",
      courses: [
        { name: "Information Technology", duration: "4 Years", fees: 85000 },
        { name: "Computer Engineering", duration: "4 Years", fees: 85000 },
        { name: "Electrical Engineering", duration: "4 Years", fees: 85000 }
      ]
    },
    {
      name: "Sardar Patel Institute of Technology (SPIT)",
      description: "A top private engineering college in Mumbai known for high academic standards and placements.",
      location: "Andheri, Mumbai",
      fees: 170000,
      rating: 4.6,
      placementRate: 93,
      image: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Sardar_Patel_Institute_of_Technology.jpg",
      courses: [
        { name: "Computer Engineering", duration: "4 Years", fees: 170000 },
        { name: "Data Science", duration: "4 Years", fees: 170000 },
        { name: "Electronics", duration: "4 Years", fees: 170000 }
      ]
    },
    {
      name: "Dwarkadas J. Sanghvi College of Engineering",
      description: "Consistently ranked among the top engineering colleges in Mumbai and Maharashtra.",
      location: "Vile Parle, Mumbai",
      fees: 200000,
      rating: 4.5,
      placementRate: 89,
      image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
      courses: [
        { name: "Computer Engineering", duration: "4 Years", fees: 200000 },
        { name: "Artificial Intelligence", duration: "4 Years", fees: 200000 },
        { name: "Mechanical Engineering", duration: "4 Years", fees: 200000 }
      ]
    },
    {
      name: "K. J. Somaiya College of Engineering",
      description: "A constituent college of Somaiya Vidyavihar University with a sprawling campus and modern labs.",
      location: "Vidyavihar, Mumbai",
      fees: 350000,
      rating: 4.4,
      placementRate: 86,
      image: "https://images.unsplash.com/photo-1523050335456-adabbf72c766?auto=format&fit=crop&q=80&w=800",
      courses: [
        { name: "Computer Science", duration: "4 Years", fees: 350000 },
        { name: "Cyber Security", duration: "4 Years", fees: 350000 },
        { name: "Electronics", duration: "4 Years", fees: 350000 }
      ]
    },
    {
      name: "Thadomal Shahani Engineering College",
      description: "One of the oldest private engineering colleges in Mumbai with a strong reputation in IT/CS.",
      location: "Bandra, Mumbai",
      fees: 185000,
      rating: 4.3,
      placementRate: 84,
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
      courses: [
        { name: "Information Technology", duration: "4 Years", fees: 185000 },
        { name: "Computer Science", duration: "4 Years", fees: 185000 },
        { name: "AI and Data Science", duration: "4 Years", fees: 185000 }
      ]
    },
    {
      name: "Walchand College of Engineering",
      description: "A prestigious government-aided autonomous institute in Sangli with a rich history of technical excellence.",
      location: "Vishrambag, Sangli",
      fees: 85000,
      rating: 4.7,
      placementRate: 90,
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a1/WCE_Main_Building.jpg",
      courses: [
        { name: "Computer Science", duration: "4 Years", fees: 85000 },
        { name: "Information Technology", duration: "4 Years", fees: 85000 },
        { name: "Electronics", duration: "4 Years", fees: 85000 }
      ]
    },
    {
      name: "Karmaveer Bhaurao Patil College of Engineering",
      description: "A well-known institute in Satara offering quality technical education to rural and urban students.",
      location: "Sadar Bazar, Satara",
      fees: 95000,
      rating: 4.1,
      placementRate: 75,
      image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
      courses: [
        { name: "Mechanical Engineering", duration: "4 Years", fees: 95000 },
        { name: "Civil Engineering", duration: "4 Years", fees: 95000 },
        { name: "Computer Science", duration: "4 Years", fees: 95000 }
      ]
    },
    {
      name: "National Institute of Technology Karnataka (NITK)",
      description: "A premier technical university in India located on a beautiful beach-side campus in Surathkal.",
      location: "Surathkal, Karnataka",
      fees: 150000,
      rating: 4.9,
      placementRate: 96,
      image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/NITK_surathkal.jpg",
      courses: [
        { name: "Computer Science", duration: "4 Years", fees: 150000 },
        { name: "Information Technology", duration: "4 Years", fees: 150000 },
        { name: "Artificial Intelligence", duration: "4 Years", fees: 150000 }
      ]
    },
    {
      name: "Visvesvaraya National Institute of Technology (VNIT)",
      description: "A premier public technical university and an Institute of National Importance in Nagpur.",
      location: "Nagpur, Maharashtra",
      fees: 125000,
      rating: 4.8,
      placementRate: 94,
      image: "https://upload.wikimedia.org/wikipedia/commons/8/8e/VNIT_Main_Building.jpg",
      courses: [
        { name: "Computer Science", duration: "4 Years", fees: 125000 },
        { name: "Mechanical Engineering", duration: "4 Years", fees: 125000 }
      ]
    },
    {
      name: "National Institute of Technology Goa (NIT Goa)",
      description: "A premier technical institute offering high-quality education and research in the heart of Goa.",
      location: "Ponda, Goa",
      fees: 135000,
      rating: 4.5,
      placementRate: 88,
      image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=800",
      courses: [
        { name: "Computer Science", duration: "4 Years", fees: 135000 },
        { name: "Electronics Engineering", duration: "4 Years", fees: 135000 }
      ]
    },
    {
      name: "Indian Institute of Information Technology (IIIT), Pune",
      description: "Focuses on information technology and related areas with a strong emphasis on research and innovation.",
      location: "Aundh, Pune",
      fees: 220000,
      rating: 4.6,
      placementRate: 91,
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
      courses: [
        { name: "Computer Science", duration: "4 Years", fees: 220000 },
        { name: "Information Technology", duration: "4 Years", fees: 220000 }
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
