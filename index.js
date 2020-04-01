import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { signup, signin } from './controllers/Auth';
import { getToken, verifyToken } from './utils/token';
import User from './models/User';
import { allowIfLoggedIn } from './middlewares/loggedIn';

const PORT = process.env.PORT || 3000
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(async (req, res, next) => {
  const token = getToken(req, next);
  if(!token.length) return next();
  try {
    const userId = await verifyToken(token);
    console.log({userId});
    res.locals.loggedInUser = await User.findById(userId);
    next();
  } catch (error) {
    res.status(401).json({ error:error.message });
  }
});


app.post('/api/auth/signup', signup);
app.post('/api/auth/signin', signin);

app.get('/test', allowIfLoggedIn, (req, res) => {
  res.status(200).json({
    message: 'Its working'
  })
})

app.listen(PORT, () => console.log(`app is running on port ${PORT}`))
