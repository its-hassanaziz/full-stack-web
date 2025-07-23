const express = require('express');
const { body, validationResult } = require('express-validator');
const Game = require('../models/Game');
const { auth } = require('../middleware/auth');
const { uploadGameFiles } = require('../middleware/upload');

const router = express.Router();

// Get all games (public)
router.get('/', async (req, res) => {
  try {
    const { search, limit = 20, page = 1 } = req.query;
    const query = { isActive: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const games = await Game.find(query)
      .select('name slug logo sections.overview downloadCount createdAt')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Failed to fetch games' });
  }
});

// Get single game by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const game = await Game.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    });
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Increment download count (for analytics)
    await Game.findByIdAndUpdate(game._id, { 
      $inc: { downloadCount: 1 } 
    });
    
    res.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ message: 'Failed to fetch game' });
  }
});

// Create new game (admin only)
router.post('/', 
  auth,
  uploadGameFiles,
  [
    body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Game name is required and must be less than 100 characters'),
    body('downloadLink').isURL().withMessage('Valid download link is required'),
    body('sections.overview.text').trim().isLength({ min: 1, max: 2000 }).withMessage('Overview text is required'),
    body('sections.versions.text').trim().isLength({ min: 1, max: 2000 }).withMessage('Versions text is required'),
    body('sections.uses.text').trim().isLength({ min: 1, max: 2000 }).withMessage('Uses text is required'),
    body('sections.features.text').trim().isLength({ min: 1, max: 2000 }).withMessage('Features text is required'),
    body('sections.system.text').trim().isLength({ min: 1, max: 2000 }).withMessage('System requirements text is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const gameData = {
        name: req.body.name,
        downloadLink: req.body.downloadLink,
        sections: {
          overview: { text: req.body['sections[overview][text]'] },
          versions: { text: req.body['sections[versions][text]'] },
          uses: { text: req.body['sections[uses][text]'] },
          features: { text: req.body['sections[features][text]'] },
          system: { text: req.body['sections[system][text]'] }
        }
      };

      // Handle file uploads
      if (req.files) {
        if (req.files.logo) {
          gameData.logo = req.files.logo[0].path;
        }
        
        // Handle section images
        const sections = ['overview', 'versions', 'uses', 'features', 'system'];
        sections.forEach(section => {
          const fieldName = `sections[${section}][image]`;
          if (req.files[fieldName]) {
            gameData.sections[section].image = req.files[fieldName][0].path;
          }
        });
      }

      // Handle alternatives
      if (req.body.alternatives) {
        const alternatives = Array.isArray(req.body.alternatives) 
          ? req.body.alternatives 
          : [req.body.alternatives];
        gameData.alternatives = alternatives.filter(alt => alt && alt.trim());
      }

      const game = new Game(gameData);
      await game.save();
      
      res.status(201).json(game);
    } catch (error) {
      console.error('Error creating game:', error);
      if (error.code === 11000) {
        res.status(400).json({ message: 'A game with this name already exists' });
      } else {
        res.status(500).json({ message: 'Failed to create game' });
      }
    }
  }
);

// Update game (admin only)
router.put('/:id', 
  auth,
  uploadGameFiles,
  async (req, res) => {
    try {
      const game = await Game.findById(req.params.id);
      if (!game) {
        return res.status(404).json({ message: 'Game not found' });
      }

      // Update fields
      const updateData = {};
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.downloadLink) updateData.downloadLink = req.body.downloadLink;
      
      // Update sections
      if (req.body['sections[overview][text]']) {
        updateData['sections.overview.text'] = req.body['sections[overview][text]'];
      }
      // ... similar for other sections

      // Handle file uploads
      if (req.files) {
        if (req.files.logo) {
          updateData.logo = req.files.logo[0].path;
        }
        // ... handle section images
      }

      const updatedGame = await Game.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      res.json(updatedGame);
    } catch (error) {
      console.error('Error updating game:', error);
      res.status(500).json({ message: 'Failed to update game' });
    }
  }
);

// Delete game (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Soft delete by setting isActive to false
    await Game.findByIdAndUpdate(req.params.id, { isActive: false });
    
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ message: 'Failed to delete game' });
  }
});

module.exports = router;