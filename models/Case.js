import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    image: { type: String },
    client: { type: String }
});

export default mongoose.model('Case', caseSchema);
