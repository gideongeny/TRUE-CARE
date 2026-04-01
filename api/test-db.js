const { Client } = require('pg');
const connectionString = "postgresql://postgres.azqetozirazsomncruir:AdminTrueCare%232026!@db.azqetozirazsomncruir.supabase.co:5432/postgres?sslmode=require";

async function test() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected Successfully! 🎉");
    const res = await client.query('SELECT NOW()');
    console.log("Time from DB:", res.rows[0]);
    await client.end();
  } catch (err) {
    console.error("Connection Failed: ❌", err);
  }
}

test();
