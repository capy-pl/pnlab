import mongoose, { Document, Schema } from 'mongoose';
import { FieldSchemaInterface } from './ImportSchema';

export interface Node {
  name: string;
  community: number;
  id: number;
  degree: number;
  weight: number;
  core: boolean;
}

interface SimpleNode {
  name: string;
  weight: number;
}

export interface Edge {
  from: number;
  to: number;
  weight: number;
}

export interface Community {
  core?: string;
  id: number;
  items: SimpleNode[];
  weight: number;
}

export interface Condition extends FieldSchemaInterface {
  name: string | 'filterGroups' | 'filterItems';
}

export interface Hook {
  name: string;
  connectTo: number[];
}

export interface ReportInterface extends Document {
  created: Date;
  conditions: Condition[];
  modified: Date;
  rank: SimpleNode[];
  communities: Community[];
  status: 'error' | 'pending' | 'success';
  errorMessage: string;
  nodes: Node[];
  edges: Edge[];
  startTime: Date;
  endTime: Date;
}

const ConditionSchema = new Schema<Condition>({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  values: {
    type: [String],
    required: true,
  },
});

const NodeSchema = new Schema<Node>({
  name: {
    type: String,
    required: true,
  },
  community: {
    type: Number,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  degree: {
    type: Number,
    required: true,
  },
  core: Boolean,
});

const SimpleNodeSchema = new Schema<SimpleNode>({
  name: String,
  weight: Number,
});

const EdgeSchema = new Schema<Edge>({
  from: {
    type: Number,
    required: true,
  },
  to: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
});

const CommunitySchema = new Schema<Community>({
  core: String,
  items: {
    type: [SimpleNodeSchema],
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
});

const HookSchema = new Schema<Hook>({
  name: String,
  weight: Number,
  connectTo: [Number],
});

const ReportSchema = new Schema<ReportInterface>({
  conditions: [ConditionSchema],
  edges: [NodeSchema],
  nodes: [EdgeSchema],
  status: {
    type: String,
    enum: ['error', 'pending', 'success'],
    required: true,
  },
  created: {
    type: Date,
    required: true,
  },
  communities: {
    type: [CommunitySchema],
  },
  modified: {
    type: Date,
    required: true,
  },
  hooks: {
    type: [HookSchema],
  },
  errorMessage: String,
  startTime: {
    type: Date,
    // required: true
  },
  endTime: {
    type: Date,
    // required: true
  },
  rank: [SimpleNodeSchema],
});

const Report = mongoose.model<ReportInterface>('report', ReportSchema);

export default Report;
