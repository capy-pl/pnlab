import { Edge as VisEdge, IdType, Node as VisNode } from 'vis';
import { User } from './Model';

interface LocalVar {
  user?: User;
  data: Data;
}

export interface Node extends VisNode {
  name: string;
  community: number;
  label: string;
  id: IdType;
  degree: number;
  value: number;
}

export interface Edge extends VisEdge {
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
