const express = require('express');
const taskRoutes = require('./routes/routesTaskUser.js');
const userRoutes = require('./routes/routesUser.js');
const PORT = 3000;
const app = express();
app.use(express.json());


app.use('/tasks', taskRoutes);
//app.use('/users', userRoutes);

module.exports = app;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});