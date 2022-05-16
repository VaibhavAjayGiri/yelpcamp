const mongoose = require("mongoose");
const Campground = require('../model/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelper')

mongoose.connect('mongodb://localhost:27017/moviesApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(data => {
        console.log('DataBase Conneted')
    })
    .catch(err => {
        console.log("Error Accored")
        console.log(err);
    })


const sample = array => array[Math.floor(Math.random() * array.length)];
const seedb = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i <= 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 100)+1;
        const camp = new Campground({
            author : '62710a3750035772b030482c' , 
            location: `${cities[random1000].city} ${cities[random1000].state}`,
            tittle: `${sample(descriptors)} ${sample(places)}`,
            Image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati praesentium maxime velit dolores eius, magnam incidunt dolorum quam. Atque tenetur ab velit! Similique totam placeat repudiandae nulla, distinctio officiis rerum.',
            price : price 
        })
        await camp.save();
    }
}

seedb(); 