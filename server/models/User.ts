import mongoose, { PassportLocalSchema, Schema  } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

interface UserSchemaInterface {
  email: string;
  org: Schema.Types.ObjectId;
}

const UserSchema = new Schema<UserSchemaInterface>({
  email: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
  },
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
