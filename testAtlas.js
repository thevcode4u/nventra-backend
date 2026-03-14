import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const test = async () => {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');
        
        const count = await User.countDocuments();
        console.log('Total users:', count);
        
        const admin = await User.findOne({ email: 'admin@inventra.in' });
        console.log('Admin found:', admin ? 'YES' : 'NO');
        
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err);
        process.exit(1);
    }
};

test();
