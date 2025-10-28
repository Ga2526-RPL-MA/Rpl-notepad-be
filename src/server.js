const express = require('express');
const port = 3000;
const app = express();

app.use(express.json());

const taskRoutes = require('./routes/task.routes.js');
app.use('/tasks', taskRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});