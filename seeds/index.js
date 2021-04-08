'use strict';

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Dogpark = require('../models/dogpark');
const { captureRejectionSymbol } = require('events');

mongoose.connect('mongodb://localhost:27017/canine-park', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Dogpark.deleteMany({});
  for (let i = 0; i < 400; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 15) + 7;
    const park = new Dogpark({
      //YOUR USER ID
      author: '6050ddfd283a612f1c797986',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      price,
      geometry: {
        type: 'Point',
        coordinates: [cities[random1000].longitude, cities[random1000].latitude],
      },
      images: [
        {
          url:
            'https://res.cloudinary.com/tmood-enterprise/image/upload/v1615990586/CaninePark/vjbyoprargiztibfbrwa.jpg',
          filename: 'CaninePark/vjbyoprargiztibfbrwa',
        },
        {
          url:
            'https://res.cloudinary.com/tmood-enterprise/image/upload/v1615990586/CaninePark/fdrxqokzzhecuy28a3iy.jpg',
          filename: 'CaninePark/fdrxqokzzhecuy28a3iy',
        },
        {
          url:
            'https://res.cloudinary.com/tmood-enterprise/image/upload/v1615990586/CaninePark/srtpw1olffdzidukwjvi.jpg',
          filename: 'CaninePark/srtpw1olffdzidukwjvi',
        },
      ],
    });
    await park.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
