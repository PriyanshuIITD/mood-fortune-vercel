require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB error:', err));

const moodSchema = new mongoose.Schema({
  mood: String,
  note: String,
  fortune: String,
  date: { type: Date, default: Date.now }
});
const Mood = mongoose.model('Mood', moodSchema);

app.get('/moods', async (req, res) => {
  try {
    const moods = await Mood.find().sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    console.error('GET error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/moods', async (req, res) => {
  try {
    const newMood = new Mood({
      mood: req.body.mood,
      note: req.body.note,
      fortune: req.body.fortune
    });
    await newMood.save();
    res.json(newMood);
  } catch (err) {
    console.error('POST error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server on port ${PORT}`));
}

module.exports = app;