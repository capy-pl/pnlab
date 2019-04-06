import mongoose, { PassportLocalSchema, Schema  } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

interface UserSchema {
  email: string;
  org: Schema.Types.ObjectId;
}

const UserSchema = new Schema<UserSchema>({
  email: String,
  org: {
    ref: 'Org',
    type: Schema.Types.ObjectId,
  },
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
});

const User: mongoose.PassportLocalModel<mongoose.PassportLocalDocument> =
  mongoose.model('User', UserSchema as PassportLocalSchema );

export default User;
