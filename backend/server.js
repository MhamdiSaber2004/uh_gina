const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const {connectDB} = require('./utils/db'); 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const authRouter = require('./router/authRouter');
app.use('/api/auth', authRouter);

const commandeRouter = require('./router/commandeRouter');
app.use('/api/commandes', commandeRouter);


const PORT = process.env.PORT || 3001;

connectDB()
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});