const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const port = 5000;
const app = express();

app.use(helmet());

const corsConfig = {
  origin: ['https://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credetials: true
};

app.use(cors(corsConfig));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Rpl Notepad Backend is running');
});

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

const userClassesRouter = require('./routes/userClasses.route');
app.use('/userClasses', userClassesRouter);

const taskRoutes = require('./routes/task.routes');
app.use('/tasks', taskRoutes);

const issueRoutes = require('./routes/issue.routes');
app.use('/issues', issueRoutes);

const answerRoutes = require('./routes/answer.routes');
app.use('/answers', answerRoutes);

const subAnswerRoutes = require('./routes/subAnswer.routes');
app.use('/subAnswers', subAnswerRoutes);

const testRouter = require('./routes/test.routes');
app.use('/test', testRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});