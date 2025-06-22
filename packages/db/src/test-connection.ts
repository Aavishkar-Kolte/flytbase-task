import { connectDB, AppDataSource } from './index.js';

async function test() {
    await connectDB();
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        console.log("Connection test successful and connection closed.");
    }
}

test(); 