const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const registerRouter = require('./auth/register');
app.use('/register', registerRouter);

const loginRouter = require('./auth/login');
app.use('/login', loginRouter);

const refreshTokenRouter = require('./auth/refresh');
app.use('/refresh', refreshTokenRouter);

const logoutRouter = require('./auth/logout');
app.use('/logout', logoutRouter);

const testRouter = require('./routes/test.routes');
app.use('/test', testRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});