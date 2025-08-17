//core
import mongoose from 'mongoose';
//helpers
import handleMongooseError from '../helpers/handleMongooseError.js'; // Import the error handler

const { Schema } = mongoose;

const FileOptionsSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

FileOptionsSchema.post('save', handleMongooseError);

FileOptionsSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } }
);
FileOptionsSchema.index(
  { isDefault: 1 },
  { unique: true, partialFilterExpression: { isDefault: true } }
);

const getFileOptionsModel = () =>
  mongoose.model('FileOption', FileOptionsSchema, 'fileOptions');

export default getFileOptionsModel;
