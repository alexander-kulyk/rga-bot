import loadDocx from '../helpers/loadDocx.js';

const loadDocxController = () => async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File is required' });
  }

  try {
    await loadDocx(req.file.buffer, req.file.originalname);
    res.status(200).json({ message: 'File processed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process file' });
  }
};

export default loadDocxController;
