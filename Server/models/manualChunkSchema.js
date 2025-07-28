//core
import mongoose from 'mongoose';
//helpers
import handleMongooseError from '../helpers/handleMongooseError.js'; // Import the error handler

const { Schema } = mongoose;

const ChunkSchema = new Schema(
  {
    pageContent: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      loc: {
        type: [Schema.Types.Mixed],
        default: [],
      },
      // Additional arbitrary metadata fields
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    versionKey: false,
  }
);

ChunkSchema.post('save', handleMongooseError);

const getChunkModel = (nameCollation) =>
  mongoose.model('ChunkModel', ChunkSchema, nameCollation);

export default getChunkModel;
