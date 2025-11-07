//core
import getCatModel from '../models/catSchema.js';

const Cat = getCatModel();

// GET /api/cats - Get all cats
export const getCats = async (req, res) => {
  try {
    const cats = await Cat.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      cats,
      message: 'Cats retrieved successfully',
    });
  } catch (error) {
    console.error('Error retrieving cats:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve cats',
      error: error.message,
    });
  }
};

// GET /api/cats/:id - Get a single cat by ID
export const getCatById = async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id);

    if (!cat) {
      return res.status(404).json({
        success: false,
        message: 'Cat not found',
      });
    }

    res.status(200).json({
      success: true,
      cat,
      message: 'Cat retrieved successfully',
    });
  } catch (error) {
    console.error('Error retrieving cat:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve cat',
      error: error.message,
    });
  }
};

// POST /api/cats - Create a new cat
export const createCat = async (req, res) => {
  try {
    const { name, age, breed, color } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Cat name is required',
      });
    }

    const newCat = new Cat({
      name,
      age,
      breed,
      color,
    });

    await newCat.save();

    res.status(201).json({
      success: true,
      cat: newCat,
      message: 'Cat created successfully',
    });
  } catch (error) {
    console.error('Error creating cat:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create cat',
      error: error.message,
    });
  }
};

// PUT /api/cats/:id - Update a cat
export const updateCat = async (req, res) => {
  try {
    const { name, age, breed, color } = req.body;
    
    // Filter out undefined values to only update provided fields
    const updateData = Object.fromEntries(
      Object.entries({ name, age, breed, color }).filter(([_, v]) => v !== undefined)
    );

    const cat = await Cat.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!cat) {
      return res.status(404).json({
        success: false,
        message: 'Cat not found',
      });
    }

    res.status(200).json({
      success: true,
      cat,
      message: 'Cat updated successfully',
    });
  } catch (error) {
    console.error('Error updating cat:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update cat',
      error: error.message,
    });
  }
};

// DELETE /api/cats/:id - Delete a cat
export const deleteCat = async (req, res) => {
  try {
    const cat = await Cat.findByIdAndDelete(req.params.id);

    if (!cat) {
      return res.status(404).json({
        success: false,
        message: 'Cat not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cat deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting cat:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete cat',
      error: error.message,
    });
  }
};
