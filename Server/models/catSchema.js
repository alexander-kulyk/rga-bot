//core
import mongoose from 'mongoose';
//helpers
import handleMongooseError from '../helpers/handleMongooseError.js'; // Import the error handler

const { Schema } = mongoose;

const CatSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: false,
    },
    breed: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    versionKey: false,
  }
);

CatSchema.post('save', handleMongooseError);

const getCatModel = () => mongoose.model('Cat', CatSchema, 'cats');

export default getCatModel;
