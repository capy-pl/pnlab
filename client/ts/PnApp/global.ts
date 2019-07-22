import { User } from './model';

interface Store {
  user?: User;
}

const Store: Store  = {
  user: undefined,
};

export default Store;
