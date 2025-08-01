import { migrate } from "drizzle-orm/neon-http/migrator";
import { db } from ".";

const main = async () => {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] Starting database migration...`);
  
  try {
    await migrate(db, { migrationsFolder: "drizzle/migrations" });
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[${new Date().toISOString()}] ✅ Migration completed successfully in ${duration}s`);
  } catch (error: unknown) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`[${new Date().toISOString()}] ❌ Migration failed after ${duration}s`);
    
    if (error instanceof Error) {
      console.error(`Error details: ${error.message}`);
      if (error.stack) {
        console.error(`Stack trace:\n${error.stack}`);
      }
    } else {
      console.error(`Error details: ${String(error)}`);
    }
    
    process.exit(1);
  }
  
  process.exit(0);
};

main();