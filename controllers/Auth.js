import bcrypt from 'bcrypt';
import { createToken } from '../utils/token';
import User from '../models/User';

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export const signup = async (req, res, next) => {
  try {
    // let { first, last, username, email, password, role = 'basic' } = req.body
    const hashedPassword = await hashPassword(req.body.password);
    console.log({...req.body, hashedPassword})
    const newUser = new User({ ...req.body, password: hashedPassword });
    console.log({new: newUser.password})
    const { token } = createToken({userId: newUser._id});
    console.log({token})
    newUser.accessToken = token;
    const { _id, password, isDeleted,...publicData } = (await newUser.save()).toJSON();
    console.log('user', publicData);
    res.json({
      user: publicData,
      message: "You have signed up successfully"
    })
  } catch (error) {
    // next(error)
    if(error.name === 'ValidationError') return handleError(error, res);

    return res.status(500).json({ message: 'Error while creating new user' })
  }
}

export const signin = async (req, res, next) => {
  try {
    const { username, email, password:pwd } = req.body;
    const user = await User.findOne({ $or: [ { email }, { username } ] });
    if (!user) return next(new Error('Email does not exist'));
    // if (!user) throw new Error('Email does not exist');
    const validPassword = await validatePassword(pwd, user.password);
    if (!validPassword) return next(new Error('Password is not correct'))
    const { token } = createToken({userId: user._id});
    user.accessToken = token;
    const { _id, password, isDeleted,...publicData } = (await user.save()).toJSON();
    res.status(200).json({
      user: publicData,
      message: "You have logged in successfully"
    })
  } catch (error) {
    next(error);
  }
}

function handleError(err, res){
  const messages = []
  for (let field in err.errors) {
    messages.push(err.errors[field].message)
    console.log(err.errors[field].message)
  }
  res.status(422).json({ messages })
}
