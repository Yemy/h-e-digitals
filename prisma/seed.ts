import { PrismaClient, Role, Difficulty, CourseStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cpd.com' },
    update: {},
    create: {
      email: 'admin@cpd.com',
      name: 'Admin User',
      password: adminPassword,
      role: Role.ADMIN,
      isVerified: true,
    },
  })

  // Create instructor
  const instructorPassword = await bcrypt.hash('instructor123', 10)
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@cpd.com' },
    update: {},
    create: {
      email: 'instructor@cpd.com',
      name: 'John Instructor',
      password: instructorPassword,
      role: Role.INSTRUCTOR,
      isVerified: true,
      bio: 'Experienced educator with 10+ years in professional development',
    },
  })

  // Create student
  const studentPassword = await bcrypt.hash('student123', 10)
  const student = await prisma.user.upsert({
    where: { email: 'student@cpd.com' },
    update: {},
    create: {
      email: 'student@cpd.com',
      name: 'Jane Student',
      password: studentPassword,
      role: Role.STUDENT,
      isVerified: true,
    },
  })

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'healthcare' },
      update: {},
      create: {
        name: 'Healthcare',
        slug: 'healthcare',
        description: 'Medical and healthcare professional development',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'business' },
      update: {},
      create: {
        name: 'Business',
        slug: 'business',
        description: 'Business management and leadership courses',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology',
        description: 'IT and software development courses',
      },
    }),
  ])

  // Create sample course
  const course = await prisma.course.create({
    data: {
      title: 'Introduction to Patient Care',
      slug: 'introduction-to-patient-care',
      description: 'Learn the fundamentals of patient care and medical ethics',
      difficulty: Difficulty.BEGINNER,
      cpdHours: 10,
      price: 99.99,
      status: CourseStatus.PUBLISHED,
      categoryId: categories[0].id,
      instructorId: instructor.id,
      passPercentage: 80,
      maxRetries: 3,
    },
  })

  // Create modules
  const module1 = await prisma.module.create({
    data: {
      title: 'Introduction to Healthcare',
      description: 'Overview of healthcare systems and patient care',
      order: 1,
      courseId: course.id,
    },
  })

  // Create lessons
  await prisma.lesson.createMany({
    data: [
      {
        title: 'Healthcare Basics',
        description: 'Understanding healthcare fundamentals',
        content: 'This lesson covers the basic principles of healthcare...',
        videoUrl: 'https://www.youtube.com/watch?v=example',
        duration: 1800,
        order: 1,
        moduleId: module1.id,
      },
      {
        title: 'Patient Communication',
        description: 'Effective communication with patients',
        content: 'Learn how to communicate effectively with patients...',
        videoUrl: 'https://www.youtube.com/watch?v=example2',
        duration: 2400,
        order: 2,
        moduleId: module1.id,
      },
    ],
  })

  // Create quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: 'Module 1 Quiz',
      description: 'Test your knowledge of healthcare basics',
      moduleId: module1.id,
      timeLimit: 1800,
      passScore: 80,
    },
  })

  // Create questions
  const question1 = await prisma.question.create({
    data: {
      question: 'What is the primary goal of patient care?',
      type: 'MCQ',
      points: 1,
      order: 1,
      quizId: quiz.id,
    },
  })

  await prisma.option.createMany({
    data: [
      { text: 'To ensure patient safety and well-being', isCorrect: true, questionId: question1.id },
      { text: 'To maximize hospital profits', isCorrect: false, questionId: question1.id },
      { text: 'To reduce staff workload', isCorrect: false, questionId: question1.id },
      { text: 'To minimize patient visits', isCorrect: false, questionId: question1.id },
    ],
  })

  console.log('✅ Database seeded successfully!')
  console.log('\n📧 Test Accounts:')
  console.log('Admin: admin@cpd.com / admin123')
  console.log('Instructor: instructor@cpd.com / instructor123')
  console.log('Student: student@cpd.com / student123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
