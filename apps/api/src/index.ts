import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import drugsRouter from './routes/drugs';
import prescriptionsRouter from './routes/prescriptions';
import teachingRouter from './routes/teaching';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/drugs', drugsRouter);
app.use('/api/prescriptions', prescriptionsRouter);
app.use('/api/teaching', teachingRouter);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Agadham OS API running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
