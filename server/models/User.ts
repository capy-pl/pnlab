import mongoose, { PassportLocalSchema, Schema  } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new Schema({
  email: String,
});

UserSchema.plugin(passportLocalMongoose, {
  org: Schema.Types.ObjectId,
  usernameField: 'email',
});

const User: mongoose.PassportLocalModel<mongoose.PassportLocalDocument> =
  mongoose.model('User', UserSchema as PassportLocalSchema );

export default User;
