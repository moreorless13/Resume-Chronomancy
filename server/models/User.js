const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const { Skills } = require('./Skills');
const { Education } = require('./Education');
const { Experience } = require('./Experience');
const {UserInfo} = require('./UserInfo');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must match an email address!'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  skills: [{ type: Schema.Types.ObjectId, ref: 'Skills' }],
  experiences: [{ type: Schema.Types.ObjectId, ref: 'Experience' }],
  educations: [{ type: Schema.Types.ObjectId, ref: 'Education' }],
  userInfos: [{ type: Schema.Types.ObjectId, ref: 'UserInfo'}]
});

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;
