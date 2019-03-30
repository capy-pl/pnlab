import mongoose, { PassportLocalSchema  } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: String,
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
});

const User: mongoose.PassportLocalModel<mongoose.PassportLocalDocument> =
  mongoose.model('User', UserSchema as PassportLocalSchema );

export default User;
