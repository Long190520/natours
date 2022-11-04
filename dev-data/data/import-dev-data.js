const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connections Successfull');
  });

//Read JS file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf8')
);

//Import data to MongoDB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Import Successful');
  } catch (error) {
    console.log(error);
  }
  process.exit(0);
};

//Delete data from MongoDB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Deleted database');
  } catch (error) {
    console.log(error);
  }
  process.exit(0);
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);

//node dev-data/data/import-dev-data.js --import/delete
