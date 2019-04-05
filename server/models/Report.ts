import mongoose, { Schema } from 'mongoose';

const ConditionSchema = new Schema({
  edgeAttrs: [ String ],
  filterGroups: [ Schema.Types.ObjectId ],
  itemAttrs: [ String ],
  items: [ String ],
});

const ReportSchema = new Schema({
  communities: [],
  conditions: ConditionSchema,
  edges: [],
  nodes: [],
});

const Report = mongoose.model('report', ReportSchema);

export default Report;
