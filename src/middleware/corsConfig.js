const corsConfig = {
  origin: ['https://localhost:3000', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  credentials: true
};

module.exports = corsConfig;