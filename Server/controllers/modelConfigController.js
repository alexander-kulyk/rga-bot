//core
import mongoose from 'mongoose';
//models
import getModelConfigsModel from '../models/modelConfigs.js';

const ModelConfigs = getModelConfigsModel();

// Get all model configurations
export const getModelConfigs = async (req, res) => {
  try {
    const configs = await ModelConfigs.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: configs,
      message: 'Model configurations retrieved successfully',
    });
  } catch (error) {
    console.error('Error retrieving model configurations:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve model configurations',
      error: error.message,
    });
  }
};

// Update or create model configuration
export const updateModelConfig = async (req, res) => {
  try {
    const { model, temperature, top_p, max_tokens } = req.body;

    // Validate required fields
    if (
      !model ||
      temperature === undefined ||
      top_p === undefined ||
      max_tokens === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          'All fields are required: model, temperature, top_p, max_tokens',
      });
    }

    // Validate model enum
    const validModels = ['gpt-4o', 'gpt-3.5-turbo', 'gpt-4', 'gpt-5'];
    if (!validModels.includes(model)) {
      return res.status(400).json({
        success: false,
        message: `Invalid model. Must be one of: ${validModels.join(', ')}`,
      });
    }

    // Validate numeric ranges
    if (temperature < 0 || temperature > 2) {
      return res.status(400).json({
        success: false,
        message: 'Temperature must be between 0 and 2',
      });
    }

    if (top_p < 0 || top_p > 1) {
      return res.status(400).json({
        success: false,
        message: 'top_p must be between 0 and 1',
      });
    }

    if (max_tokens < 1 || max_tokens > 4096) {
      return res.status(400).json({
        success: false,
        message: 'max_tokens must be between 1 and 4096',
      });
    }

    // Find existing config for this model and update, or create new one
    const updatedConfig = await ModelConfigs.findOneAndUpdate(
      { model },
      { model, temperature, top_p, max_tokens },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedConfig,
      message: 'Model configuration updated successfully',
    });
  } catch (error) {
    console.error('Error updating model configuration:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update model configuration',
      error: error.message,
    });
  }
};
