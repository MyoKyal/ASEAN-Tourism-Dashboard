const mongoose = require('mongoose');
const {
  CATEGORY_TYPES,
  CATEGORIES,
  COUNTRIES,
  ENTRANCE_FEES,
  isValidCategoryType,
} = require('../config/categoryTypes');

const yearlyVisitorSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: 2100,
    },
    visitors: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const siteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    enum: COUNTRIES,
  },
  category: {
    type: String,
    required: true,
    enum: CATEGORIES,
  },
  type: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return isValidCategoryType(this.category, value);
      },
      message: (props) =>
        `"${props.value}" is not a valid type for this category`,
    },
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator(coords) {
          return (
            Array.isArray(coords) &&
            coords.length === 2 &&
            coords[0] >= -180 &&
            coords[0] <= 180 &&
            coords[1] >= -90 &&
            coords[1] <= 90
          );
        },
        message: 'coordinates must be [lng, lat] within valid ranges',
      },
    },
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  establishedYear: {
    type: Number,
    min: 1,
    max: 2100,
  },
  yearlyVisitors: {
    type: [yearlyVisitorSchema],
    required: true,
    validate: {
      validator(arr) {
        return Array.isArray(arr) && arr.length >= 5;
      },
      message: 'yearlyVisitors must include at least 5 years of history',
    },
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  entranceFee: {
    type: String,
    required: true,
    enum: ENTRANCE_FEES,
  },
  tags: {
    type: [String],
    default: [],
  },
  imageQuery: {
    type: String,
    required: true,
    trim: true,
  },
  /** 'real' | 'invented' — for report provenance; not shown as fact claim */
  dataProvenance: {
    type: String,
    enum: ['real', 'invented'],
    default: 'real',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

siteSchema.index({ location: '2dsphere' });
siteSchema.index({ category: 1, type: 1 });
siteSchema.index({ country: 1, category: 1 });
siteSchema.index({ name: 'text' });

module.exports = mongoose.model('Site', siteSchema);
module.exports.CATEGORY_TYPES = CATEGORY_TYPES;
