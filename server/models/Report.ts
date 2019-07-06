import mongoose, { Document, Schema } from 'mongoose';
import { FieldSchemaInterface } from './ImportSchema';

export interface Node {
  name: string;
  community: number;
  id: number;
  degree: number;
  core?: boolean;
}

export interface Edge {
  from: number;
  to: number;
  weight: number;
}

export interface Condition extends FieldSchemaInterface {
  name: string | 'filterGroups' | 'filterItems';
}

export interface ReportInterface extends Document {
  created: Date;
  conditions: Condition[];
  modified: Date;
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

const ReportSchema = new Schema<ReportInterface>({
  // communities: [],
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
  modified: {
    type: Date,
    required: true,
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
});

const Report = mongoose.model<ReportInterface>('report', ReportSchema);

export default Report;
