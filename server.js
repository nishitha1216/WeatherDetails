require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an Express application
const app = express();


app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // For parsing JSON data


const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/weatherdb'; // Default to localhost if not in .env

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Weather Schema
const weatherSchema = new mongoose.Schema({
  city: String,
  temperature: Number,
  humidity: Number,
  description: String, 
  createdAt: { type: Date, default: Date.now }
});

const Weather = mongoose.model('Weather', weatherSchema);


// all cities
app.get('/api/weather', async (req, res) => {
  try {
    const weatherData = await Weather.find();
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

// specific city
app.get('/api/weather/:city', async (req, res) => {
  const city = req.params.city;
  try {
    const weatherData = await Weather.findOne({ city: city });
    if (!weatherData) {
      return res.status(404).json({ error: 'City not found' });
    }
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data for city:', error);
    res.status(500).json({ error: 'Error fetching weather data for the city' });
  }
});

// Server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
