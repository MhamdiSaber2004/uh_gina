const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const {connectDB} = require('./utils/db'); 

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://uh-gina.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, origin);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

const authRouter = require('./router/authRouter');
app.use('/api/auth', authRouter);

const commandeRouter = require('./router/commandeRouter');
app.use('/api/commandes', commandeRouter);


const PORT = process.env.PORT || 3001;

connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
