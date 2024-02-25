const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds')
const { campgroundSchema} = require('../schemas.js');
const { isLoggedIn } = require('../middleware');
const multer  = require('multer')
const {storage} = require('../cloudinary');
const upload = multer({ storage });

const validateCampground = (req, res, next)=>{
    const { error } = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}

router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn,upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))


router.get('/:id', catchAsync(campgrounds.showCampground));

router.get('/:id/edit', catchAsync(campgrounds.editCampground))

router.put('/:id', upload.array('image') , validateCampground, catchAsync(campgrounds.updateCampground))

router.delete('/:id', catchAsync(campgrounds.deleteCampground))

module.exports = router;