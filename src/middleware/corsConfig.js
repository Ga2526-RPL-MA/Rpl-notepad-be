const corsConfig = {
  origin: ['https://rpl-notepad.web.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  credentials: true
};

module.exports = corsConfig;