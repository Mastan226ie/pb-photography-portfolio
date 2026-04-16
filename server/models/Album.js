import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: true // URL or local path
  },
  photos: [{
    type: String // List of URLs or local paths
  }],
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Album = mongoose.model('Album', albumSchema);

export default Album;
