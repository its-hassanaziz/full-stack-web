const mongoose = require('mongoose');
const slugify = require('slugify');

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Game name is required'],
    trim: true,
    maxlength: [100, 'Game name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  logo: {
    type: String,
    default: ''
  },
  sections: {
    overview: {
      text: {
        type: String,
        required: [true, 'Overview text is required'],
        maxlength: [2000, 'Overview text cannot exceed 2000 characters']
      },
      image: {
        type: String,
        default: ''
      }
    },
    versions: {
      text: {
        type: String,
        required: [true, 'Versions text is required'],
        maxlength: [2000, 'Versions text cannot exceed 2000 characters']
      },
      image: {
        type: String,
        default: ''
      }
    },
    uses: {
      text: {
        type: String,
        required: [true, 'Uses text is required'],
        maxlength: [2000, 'Uses text cannot exceed 2000 characters']
      },
      image: {
        type: String,
        default: ''
      }
    },
    features: {
      text: {
        type: String,
        required: [true, 'Features text is required'],
        maxlength: [2000, 'Features text cannot exceed 2000 characters']
      },
      image: {
        type: String,
        default: ''
      }
    },
    system: {
      text: {
        type: String,
        required: [true, 'System requirements text is required'],
        maxlength: [2000, 'System requirements text cannot exceed 2000 characters']
      },
      image: {
        type: String,
        default: ''
      }
    }
  },
  alternatives: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }],
  downloadLink: {
    type: String,
    required: [true, 'Download link is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Download link must be a valid URL'
    }
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create slug from name before saving
gameSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { 
      lower: true, 
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }
  next();
});

// Populate alternatives when querying
gameSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'alternatives',
    select: 'name slug logo'
  });
  next();
});

// Index for better performance
gameSchema.index({ slug: 1 });
gameSchema.index({ name: 'text' });
gameSchema.index({ isActive: 1 });

module.exports = mongoose.model('Game', gameSchema);