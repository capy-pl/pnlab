import Migration from '../core/migration';
import Migration1 from './1_init';

const migartions: Migration[] = [new Migration1()];

export default migartions;
