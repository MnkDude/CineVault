import express from 'express';
import serverless from 'serverless-http';
// const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.get('/api/movies', async (req, res) => {
    console.log("Hai");
    let data = ["movie1", "movie2"];
    res.json(data);
});

// Add more routes as needed

export const handler = serverless(app);
export { app };