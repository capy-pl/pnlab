import mongoose, { PassportLocalDocument, PassportLocalModel, Schema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import { OrgSchema } from './Organization';

export interface UserSchemaInterface extends PassportLocalDocument {
  email: string;
  name: string;
  org: OrgSchema;
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

const User = mongoose.model<UserSchemaInterface, PassportLocalModel<UserSchemaInterface>>(
  'user',
  UserSchema,
);

export default User;
