const BASE_URL = 'http://localhost:8000';

const seed = async () => {
    console.log('Seeding users...');
    await fetch(`${BASE_URL}/seed/users`, {method: 'POST'});

    console.log('Seeding walls...');
    await fetch(`${BASE_URL}/seed/walls`, {method: 'POST'});

    console.log('Seeding pieces...');
    await fetch(`${BASE_URL}/seed/pieces`, {method: 'POST'});

    console.log('Done! Database seeded successfully.');
};

seed();