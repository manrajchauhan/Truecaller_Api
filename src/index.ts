// src/index.ts
import express from 'express';
import path from 'path';

const app = express();
const port = 3000;

// Serve static files from the 'views' folder
app.use(express.static(path.join(__dirname, 'views')));

// Expose an endpoint to serve the generatedData.json file
app.get('/generatedData.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'generatedData.json'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
