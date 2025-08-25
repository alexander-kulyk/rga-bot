//core
import getFileOptionsModel from '../models/fileOptionsSchema.js';

const FileOptions = getFileOptionsModel();

// GET /api/file-options - Get all file options
export const fileOptionsController = async (req, res) => {
  try {
    const options = await FileOptions.find({})
      .collation({ locale: 'en', strength: 2 })
      .sort({ order: 1, name: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      options,
      message: 'File options retrieved successfully',
    });
  } catch (error) {
    console.error('Error retrieving file options:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve file options',
      error: error.message,
    });
  }
};

export default fileOptionsController;
