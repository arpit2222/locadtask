const express = require('express');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
const app = express();
const PORT = 8000;


app.use(bodyParser.json());

mongoose.connect('', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });
  

// Define the Poster model using Mongoose
const PosterModel = mongoose.model('Poster', {
    Poster: String,
    Title: String,
    Type: String,
    Year: String,
    imdbID: { type: String, unique: true },
  });


// Create
app.post('/posters', async (req, res) => {
  try {
    const newPoster = new PosterModel(req.body);
    await newPoster.save();
    res.json(newPoster);
  } catch (error) {
    res.status(500).json({ error: 'Error creating poster' });
  }
});

// Read (get all posters)
app.get('/posters', async (req, res) => {
  try {
    const posters = await PosterModel.find();
    res.json(posters);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posters' });
  }
});

// Read (get poster by ID)
app.get('/posters/:id', async (req, res) => {
  try {
    const poster = await PosterModel.findOne({ imdbID: req.params.id });
    if (!poster) {
      res.status(404).json({ error: 'Poster not found' });
    } else {
      res.json(poster);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching poster' });
  }
});

// Update
app.put('/posters/:id', async (req, res) => {
  try {
    const updatedPoster = await PosterModel.findOneAndUpdate(
      { imdbID: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedPoster) {
      res.status(404).json({ error: 'Poster not found' });
    } else {
      res.json(updatedPoster);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating poster' });
  }
});

// Delete
app.delete('/posters/:id', async (req, res) => {
  try {
    const deletedPoster = await PosterModel.findOneAndDelete({
      imdbID: req.params.id,
    });
    if (!deletedPoster) {
      res.status(404).json({ error: 'Poster not found' });
    } else {
      res.json(deletedPoster);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting poster' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
