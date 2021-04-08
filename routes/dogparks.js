const express = require('express');
const router = express.Router();
const dogparks = require('../controller/dogparks');
const { isLoggedIn, isAuthor, validateDogpark } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const catchAsync = require('../utils/catchAsync');

router
  .route('/')
  .get(catchAsync(dogparks.index))
  .post(isLoggedIn, upload.array('image'), validateDogpark, catchAsync(dogparks.createDogpark));

router.get('/new', isLoggedIn, dogparks.renderNewForm);

router
  .route('/:id')
  .get(catchAsync(dogparks.showDogpark))
  .put(isLoggedIn, isAuthor, upload.array('image'), validateDogpark, catchAsync(dogparks.updateDogpark))
  .delete(isLoggedIn, isAuthor, catchAsync(dogparks.deleteDogpark));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(dogparks.renderEditForm));

module.exports = router;
