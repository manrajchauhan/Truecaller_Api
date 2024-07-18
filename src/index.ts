
import express from 'express';
import path from 'path';

const app = express();
const port = 3000;


app.use(express.static(path.join(__dirname, 'views')));


app.get('/generatedData.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'generatedData.json'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
