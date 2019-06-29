import { User } from './Model';

interface Store {
  user?: User;
}

const Store: Store  = {
  user: undefined,
};

export default Store;
