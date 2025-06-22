import { connectDB, AppDataSource } from './index.js';

async function testConnection() {
    try {
        console.log("Testing database connection...");
        await connectDB();
        
        if (AppDataSource.isInitialized) {
            console.log("✅ Database connection successful!");
            
            // Test if tables exist
            const tables = [
                'organizations', 'users', 'fleets', 'drones', 'sites', 
                'missions', 'routes', 'route_waypoints', 'mission_reports',
                'drone_telemetry', 'mission_progress'
            ];
            
            console.log("\nChecking table existence...");
            for (const table of tables) {
                try {
                    const result = await AppDataSource.query(`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '${table}')`);
                    const exists = result[0].exists;
                    console.log(`${exists ? '✅' : '❌'} ${table}: ${exists ? 'EXISTS' : 'MISSING'}`);
                } catch (error: any) {
                    console.log(`❌ ${table}: ERROR - ${error.message}`);
                }
            }
            
            // Test TimescaleDB extensions
            console.log("\nChecking TimescaleDB extensions...");
            try {
                const extensions = await AppDataSource.query(`
                    SELECT extname FROM pg_extension 
                    WHERE extname IN ('timescaledb', 'postgis', 'pgcrypto')
                `);
                const installedExtensions = extensions.map((row: any) => row.extname);
                console.log(`✅ Installed extensions: ${installedExtensions.join(', ')}`);
            } catch (error: any) {
                console.log(`❌ Extension check failed: ${error.message}`);
            }
            
            // Test hypertables
            console.log("\nChecking TimescaleDB hypertables...");
            try {
                const hypertables = await AppDataSource.query(`
                    SELECT hypertable_name FROM timescaledb_information.hypertables 
                    WHERE hypertable_name IN ('drone_telemetry', 'mission_progress')
                `);
                const tableNames = hypertables.map((row: any) => row.hypertable_name);
                console.log(`✅ Hypertables: ${tableNames.join(', ')}`);
            } catch (error: any) {
                console.log(`❌ Hypertable check failed: ${error.message}`);
            }
            
            // Test continuous aggregates
            console.log("\nChecking continuous aggregates...");
            try {
                const aggregates = await AppDataSource.query(`
                    SELECT view_name FROM timescaledb_information.continuous_aggregates
                `);
                const aggregateNames = aggregates.map((row: any) => row.view_name);
                console.log(`✅ Continuous aggregates: ${aggregateNames.join(', ')}`);
            } catch (error: any) {
                console.log(`❌ Continuous aggregate check failed: ${error.message}`);
            }
            
            await AppDataSource.destroy();
            console.log("\n✅ Connection test completed successfully!");
        }
    } catch (err) {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    }
}

testConnection(); 