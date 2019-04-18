import { User } from './Model';

interface LocalVar {
  user?: User;
  data: Data;
}

export interface Node {
  name: string;
  community: number;
  label: string;
  id: number;
  group?: number;
}

export interface Edge {
  from: number;
  to: number;
  weight: number;
}

interface Data {
  nodes: Node[];
  edges: Edge[];
}

const data: Data = require('./default');

const LocalVar: LocalVar  = {
  data,
  user: undefined,
};

export default LocalVar;
