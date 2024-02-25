const mongoose = require ('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const campground = require('../models/campground');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp' );

const db =mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open" ,()=>{
    console.log("Database connected")
});

const sample = (array) => array[Math.floor(Math.random()* array.length)];

const seedDB = async() =>{
    await Campground.deleteMany({});
    for(let i=0; i<10; i++){
        const random1000 = Math.floor(Math.random() *1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground ({
            author:'651d08141055f45960909fea',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: 'https://source.unsplash.com/collection/483251',
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae quo ratione deserunt quas explicabo consectetur harum possimus vel ea, dolorem quod illum quis incidunt sint natus rerum expedita. Id, eum.",
            price,
            images:   [
                {
                  url: 'https://res.cloudinary.com/drgj3cg4u/image/upload/v1696487097/YelpCamp/gdyahlnpa0gjudhyxwb9.jpg',
                  filename: 'YelpCamp/gdyahlnpa0gjudhyxwb9'
                }
              ]
        })
        await camp.save();
    }
}


//database open hoke apne aap close hojayga.
seedDB().then(() => {
    mongoose.connection.close();
})