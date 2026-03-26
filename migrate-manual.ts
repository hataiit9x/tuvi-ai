import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config();

async function run() {
  console.log("Connecting to", process.env.DATABASE_URL);
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  
  const files = ['0005_mean_prodigy.sql', '0006_peaceful_annihilus.sql'];
  for (const file of files) {
    const filePath = path.join(process.cwd(), 'drizzle', file);
    const sql = fs.readFileSync(filePath, 'utf-8');
    
    // Split statements by break point or semicolon for execution
    const statements = sql.split('--> statement-breakpoint').map(s => s.trim()).filter(Boolean);
    
    for (let stmt of statements) {
      if (stmt.endsWith(';')) stmt = stmt.slice(0, -1);
      try {
        console.log(`Executing from ${file}:\n${stmt.substring(0, 50)}...`);
        await connection.query(stmt);
        console.log("-> Success");
      } catch (e: any) {
        if (e.code === 'ER_TABLE_EXISTS_ERROR') {
           console.log("-> Table already exists, skipping.");
        } else {
           console.error("-> Failed:", e.message);
        }
      }
    }
  }
  
  await connection.end();
}

run().catch(console.error);
