import { encryptPassword } from '../core/crypto';
import Model from '../core/model';

export default class User extends Model {
  public collectionName: string = 'users';
  public username: string;
  private hashedPassword!: string;
  private salt!: string;
  constructor(username: string) {
    super();
    if (!(username)) {
      throw new Error('Username must be provided.');
    }
    this.username = username;
  }

  public async setPassword(password: string): Promise<void> {
    const { hashedPassword, salt } = await encryptPassword(password);
    this.hashedPassword = hashedPassword;
    this.salt = salt;
    return;
  }

  public save() {
    if (!this.hashedPassword) {
      throw new Error('Password must be set before saved.(only when create new user)');
    }
  }
}
