import "dotenv/config";
import express from 'express';

const app = express();

const PORT = process.env.PORT ?? 8000;

app.get('/health', (req, res) => {
  res.json('Server is up and running');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
