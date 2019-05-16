import mongoose, { Schema } from 'mongoose';

interface Node {
  name: string;
  community: number;
  id: number;
  degree: number;
}

interface Edge {
  from: number;
  to: number;
  weight: number;
}

interface Condition {
  name: string;
  value: string;
}

interface ReportSchemaType {
  created: Date;
  conditions: Condition[];
  modified: Date;
  status: 'string';
  errorMessage: 'string';
  nodes: Node[];
  edges: Edge[];
  filterGroups: string[];
  filterItems: string[];
  startTime: Date;
  endTime: Date;
}

const ConditionSchema = new Schema({
});

const ReportSchema = new Schema<ReportSchemaType>({
  communities: [],
  conditions: ConditionSchema,
  edges: [],
  nodes: [],
});

const Report = mongoose.model('report', ReportSchema);

export default Report;
