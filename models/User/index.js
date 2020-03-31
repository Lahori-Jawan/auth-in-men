import mongoose from '../../connection';
// import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first: { type: String, required: true, trim: true },
  last: { type: String, required: true, trim: true },
  username: { type: String, required: true, trim: true, unique: true, index: true }, // username cannot be less than 5 characters
  email: { type: String, required: true, trim: true, unique: true, index: true }, // Please provide a valid email addr.
  password: { type: String, required: true }, // min(6), max(12), 'Minimum 6 characters are needed.'
  accessToken: { type: String },
  isDeleted: { type: Boolean, default: false }
})

// UserSchema.plugin(uniqueValidator);

const User = mongoose.model('User', UserSchema)

export default User
