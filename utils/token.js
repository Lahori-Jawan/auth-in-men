import jwt from 'jsonwebtoken';

let jwtSecret = process.env.TOKEN_SECRET || 'supercsecret';
let refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'superrsecret';

export const getToken = function (req, next) { 
  if( typeof req !== 'object' || !('headers' in req) ) next(new Error('Invalid Authorization Header'))
  
  return req.headers.authorization || '' 
}

export const verifyToken = function (token) {
  try {
    const { userId } = jwt.verify(token, jwtSecret);    
    return userId
  } catch (error) {
    console.log('Error while verifying Token', token)
    throw new Error('JWT token has expired, please login to obtain a new one');
  }
}

export const createToken = function (payload, customDuration = '1d', refreshDuration = '7d') {
  const token = jwt.sign(payload, jwtSecret, {expiresIn: customDuration})
  const refreshToken = jwt.sign(payload, refreshTokenSecret, {expiresIn: refreshDuration})
  
  return { token, refreshToken }
}
