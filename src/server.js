const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const registerRouter = require('./auth/register');
app.use('/register', registerRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});