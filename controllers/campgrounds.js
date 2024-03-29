const Campground = require('../models/campground');


module.exports.index = async (req,res,next)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req,res,next)=>{
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    res.render('campgrounds/show', {campground});
}

module.exports.editCampground = async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {campground});
}

module.exports.updateCampground = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async(req,res)=>{
    const{id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}