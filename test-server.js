const express = require('express');
const app = express();

app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

app.listen(4000, () => {
  console.log('✅ Test server running at http://localhost:4000');
});
