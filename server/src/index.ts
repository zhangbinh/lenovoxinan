import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import topicsRouter from "./routes/topics";
import contentRouter from "./routes/content";

const app = express();
const port = process.env.PORT || 9091;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/topics', topicsRouter);
app.use('/api/v1/content', contentRouter);

app.get('/api/v1/health', (req, res) => {
  console.log('Health check success');
  res.status(200).json({ status: 'ok' });
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}/`);
});
