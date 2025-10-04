
import express from 'express';
import 'dotenv/config'
import { constructGlobObjectsFromGlobs } from 'crawlee';
import orgsRouter from './routes/orgs.route.js'; 
import cors from 'cors'; 

const app = express()
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use('/api/org', orgsRouter) ; 
app.use('/api', orgsRouter)

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`Access the server at: http://localhost:${PORT}`);
}); 
