const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

//https://res.cloudinary.com/tmood-enterprise/image/upload/w_200/v1615990586/CaninePark/srtpw1olffdzidukwjvi.jpg

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const DogparkSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  opts
);

DogparkSchema.virtual('properties.popUpMarkup').get(function () {
  return `<strong><a href='/dogparks/${
    this._id
  }'>${this.title}</a></strong><p>${this.description.substring(0, 30)}...</p>`;
});

DogparkSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model('Dogpark', DogparkSchema);
