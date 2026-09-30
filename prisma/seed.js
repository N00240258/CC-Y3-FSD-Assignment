import prisma from '../src/config/db.js';
// import { hashedPassword } from '../src/utils/password.js';

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

    // const hashedPassword = await hashedPassword(DEV_PASSWORD);
    const hashedPassword = DEV_PASSWORD;

    const [user1, user2, admin1] = await Promise.all([
        prisma.user.create({
            data:{
                username: "testuser1",
                email: "testuser1@example.com",
                password: hashedPassword,
                user_type: "user"
            }
        }),
        prisma.user.create({
            data:{
                username: "testuser2",
                email: "testuser2@example.com",
                password: hashedPassword,
                user_type: "user"
            }
        }),
        prisma.user.create({
            data:{
                username: "admin",
                email: "admin2@example.com",
                password: hashedPassword,
                user_type: "admin"
            }
        })
    ]);

    const [movie1] = await Promise.all([
        prisma.movie.create({
            data: {
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS60XGAhLvbTNizR5qGF8BDFMbJqbMcrZQl-_KnqrS-yQ&s",
                title: "Spider-Man: Brand New Day",
                runtime: 145,
                overview: "A forgotten Peter Parker lives alone as a full-time Spider-Man until mounting pressure triggers a dangerous change and a powerful new enemy emerges.",
                rating: 8.0,
                price: 18.99,
                release_date: new Date("2026-07-19")
            }
        }),
        prisma.movie.create({
            data: {
                image: "https://m.media-amazon.com/images/M/MV5BNDMwMmM4YWMtYWUyZi00MWZmLTk4NjQtMWViMWZhOGI1MzM5XkEyXkFqcGc@._V1_.jpg",
                title: "One Piece Film: God Valley",
                runtime: 0,
                overview: "Set 38 years before the beginning of the Great Pirate Era, the story follows the legendary God Valley Incident, where the Rocks Pirates, led by Rocks D. Xebec, confront the World Government, the Celestial Dragons, and their forces on the isolated island of God Valley. As the conflict escalates, Gol D. Roger and Monkey D. Garp join forces to face the Rocks Pirates, while the young Kuma, Ginny, and other slaves become caught in the chaos. The battle ultimately leads to the downfall of the Rocks Pirates and the disappearance of God Valley, an event that is later erased from history by the World Government.",
                rating: 0,
                price: 16.99,
                release_date: new Date("2027-01-01")
            }
        }),
        prisma.movie.create({
            data: {
                image: "https://m.media-amazon.com/images/M/MV5BMTc2MTQ3MDA1Nl5BMl5BanBnXkFtZTgwODA3OTI4NjE@._V1_.jpg",
                title: "The Martian",
                runtime: 144,
                overview: "An astronaut stranded on Mars must rely on his ingenuity to survive and arrange a potential rescue.",
                rating: 8.0,
                price: 13.99,
                release_date: new Date("2015-9-11")
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
