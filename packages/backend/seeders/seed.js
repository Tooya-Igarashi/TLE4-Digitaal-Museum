const BASE_URL = 'http://localhost:8000';

const seed = async () => {
    try {
        console.log('Seeding users...');
        const usersRes = await fetch(`${BASE_URL}/seed/users`, {
            method: 'POST',
            headers: {'x-api-key': process.env.API_KEY}
        });
        if (!usersRes.ok) throw new Error(`Failed to seed users: ${usersRes.status}`);
        console.log('Users seeded!');

        console.log('Seeding walls...');
        const wallsRes = await fetch(`${BASE_URL}/seed/walls`, {
            method: 'POST',
            headers: {'x-api-key': process.env.API_KEY}
        });
        if (!wallsRes.ok) throw new Error(`Failed to seed walls: ${wallsRes.status}`);
        console.log('Walls seeded!');

        console.log('Seeding pieces...');
        const piecesRes = await fetch(`${BASE_URL}/seed/pieces`, {
            method: 'POST',
            headers: {'x-api-key': process.env.API_KEY}
        });
        if (!piecesRes.ok) throw new Error(`Failed to seed pieces: ${piecesRes.status}`);
        console.log('Pieces seeded!');

        console.log('Done! Database seeded successfully. ');
    } catch (err) {
        console.error('Seeding failed :', err.message);
        process.exit(1);
    }
};

seed();