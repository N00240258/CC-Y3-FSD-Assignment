import prisma from '../src/config/db.js';
import { hashPassword } from '../src/utils/password.js';

const DEV_PASSWORD = 'password123';


async function main() {
    await prisma.movie.deleteMany();
    await prisma.user.deleteMany();
    await prisma.director.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.review.deleteMany();
    await prisma.order.deleteMany();
    await prisma.movie_order.deleteMany();
    await prisma.movie_genre.deleteMany();
    await prisma.movie_director.deleteMany();

    const hashedPassword = await hashPassword(DEV_PASSWORD);

    const [user1, user2, admin1] = await Promise.all([
        prisma.user.create({
            data:{
                username: "testuser1",
                email: "testuser1@example.com",
                password: hashPassword,
                user_type: "user"
            }
        }),
        prisma.user.create({
            data:{
                username: "testuser2",
                email: "testuser2@example.com",
                password: hashPassword,
                user_type: "user"
            }
        }),
        prisma.user.create({
            data:{
                username: "admin",
                email: "admin2@example.com",
                password: hashPassword,
                user_type: "admin"
            }
        })
    ]);

    const [movie1] = await Promise.all([
        prisma.movie.create({
            data: {
                image: "",
                title: "Spider-Man: Brand New Day",
                runtime: "2h 25m",
                overview: "A forgotten Peter Parker lives alone as a full-time Spider-Man until mounting pressure triggers a dangerous change and a powerful new enemy emerges.",
                rating: 8.0,
                price: 18.99,
                release_date: Date.now()
            }
        })
        
    ])

    console.log('Seed complete.');
    console.log(`Every seeded user's password is "${DEV_PASSWORD}" — e.g. POST /auth/login with casey@example.com.`);
}
main()
    .catch((err) => {
        console.error(err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
