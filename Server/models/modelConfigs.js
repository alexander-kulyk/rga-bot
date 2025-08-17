//core
import mongoose from 'mongoose';
//helpers
import handleMongooseError from '../helpers/handleMongooseError.js'; // Import the error handler

const { Schema } = mongoose;

const ModelConfigsSchema = new Schema(
  {
    model: {
      type: String,
      required: true,
      enum: ['gpt-4o', 'gpt-3.5-turbo', 'gpt-4', 'gpt-5'],
    },
    temperature: {
      type: Number,
      required: true,
    },
    top_p: {
      type: Number,
      required: true,
    },
    max_tokens: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    versionKey: false,
  }
);

ModelConfigsSchema.post('save', handleMongooseError);

const getModelConfigsModel = () =>
  mongoose.model('ModelConfigs', ModelConfigsSchema, 'modelConfigs');

export default getModelConfigsModel;
