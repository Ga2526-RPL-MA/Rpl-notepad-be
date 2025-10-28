const express = require('express');
const port = 3000;
const app = express();

app.use(express.json());

const registerRouter = require('./auth/register');
app.use('/register', registerRouter);

const loginRouter = require('./auth/login');
app.use('/login', loginRouter);

const refreshTokenRouter = require('./auth/refresh');
app.use('/refresh', refreshTokenRouter);

const logoutRouter = require('./auth/logout');
app.use('/logout', logoutRouter);

const classRouter = require('./routes/class.routes');
app.use('/class', classRouter);

const taskRoutes = require('./routes/task.routes.js');
app.use('/tasks', taskRoutes);

const testRouter = require('./routes/test.routes');
app.use('/test', testRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});