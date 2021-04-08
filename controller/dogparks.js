const Dogpark = require('../models/dogpark');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapboxToken });
const { cloudinary } = require('../cloudinary');
const geocoding = require('@mapbox/mapbox-sdk/services/geocoding');

module.exports.index = async (req, res) => {
  const dogpark = await Dogpark.find({}).populate('author');
  res.render('dogparks/index', { dogpark });
};

module.exports.renderNewForm = (req, res) => {
  res.render('dogparks/new');
};

module.exports.createDogpark = async (req, res, next) => {
  const geoData = await geoCoder
    .forwardGeocode({
      query: req.body.dogpark.location,
      limit: 1,
    })
    .send();
  const dogpark = new Dogpark(req.body.dogpark);
  dogpark.geometry = geoData.body.features[0].geometry;
  dogpark.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  dogpark.author = req.user._id;
  await dogpark.save();
  req.flash('success', 'You have successfully added a Dog Park!');
  res.redirect(`/dogparks/${dogpark._id}`);
};

module.exports.showDogpark = async (req, res) => {
  const dogpark = await Dogpark.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author');
  if (!dogpark) {
    req.flash('error', 'Cannot find that dog park!');
    return res.redirect('/dogparks');
  }
  res.render('dogparks/show', { dogpark });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const dogpark = await Dogpark.findById(id);
  if (!dogpark) {
    req.flash('error', 'Cannot find that dog park!');
    return res.redirect('/dogparks');
  }
  res.render('dogparks/edit', { dogpark });
};

module.exports.updateDogpark = async (req, res) => {
  const { id } = req.params;
  const dogpark = await Dogpark.findByIdAndUpdate(id, { ...req.body.dogpark });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  dogpark.images.push(...imgs);
  await dogpark.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await dogpark.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }
  req.flash('success', `You have successfully updated ${dogpark.title}!`);
  res.redirect(`/dogparks/${dogpark._id}`);
};

module.exports.deleteDogpark = async (req, res) => {
  const { id } = req.params;
  await Dogpark.findByIdAndDelete(id);
  req.flash('success', 'You have successfully deleted a dog park.');
  res.redirect('/dogparks');
};
