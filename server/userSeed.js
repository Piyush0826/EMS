import User from './models/User.js';
import bcrypt from 'bcryptjs';
import connectToDatabase from './db/db.js';
import dotenv from 'dotenv';

dotenv.config();

const UserRegister = async () => {
    await connectToDatabase();
    try {
        const admins = [
            { name: "Admin", email: "admin@gmail.com", password: "admin1234" },
            { name: "Piyush Pandey", email: "piyushvkb0826@gmail.com", password: "Piyushbxr19@" }
        ];

        for (const admin of admins) {
            const existingUser = await User.findOne({ email: admin.email });
            if (existingUser) {
                console.log(`${admin.email} already exists.`);
                continue;
            }

            const hashPassword = await bcrypt.hash(admin.password, 10);
            await new User({
                name: admin.name,
                email: admin.email,
                password: hashPassword,
                role: "admin"
            }).save();
            console.log(`${admin.email} seeded successfully!`);
        }
    } catch (error) {
        console.log("Seeding error:", error);
    }
};

UserRegister();