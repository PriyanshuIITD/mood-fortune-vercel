import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [moods, setMoods] = useState([]);
  const [mood, setMood] = useState('😊');
  const [note, setNote] = useState('');
  const [fortune, setFortune] = useState('');

  const fortunes = {
    '😊': ['A smile today brings luck tomorrow!', 'Happiness is your superpower—use it!'],
    '😢': ['Rain clears for sunshine soon.', 'A small cry today, a big win later.'],
    '😡': ['Channel that fire into success!', 'Anger today fuels tomorrow’s triumph.'],
    '😴': ['Rest now, conquer later.', 'Dreams tonight spark brilliance tomorrow.']
  };

  

  useEffect(() => {
    axios.get('/api/moods')
      .then(res => setMoods(res.data))
      .catch(err => console.log('Fetch error:', err));
  }, []);
  
  axios.post('/api/moods', { mood, note, fortune: randomFortune })

  const addMood = () => {
    if (note.trim() === '') {
      alert('Please add a note!');
      return;
    }
    const randomFortune = fortunes[mood][Math.floor(Math.random() * fortunes[mood].length)];
    axios.post('http://localhost:5000/moods', { mood, note, fortune: randomFortune })
      .then(res => {
        setMoods([res.data, ...moods]);
        setNote('');
        setFortune(randomFortune);
      })
      .catch(err => console.log('Post error:', err));
  };

  return (
    <div className="App">
      <h1>Mood Tracker & Fortune Teller</h1>
      <div className="mood-input">
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="😊">Happy 😊</option>
          <option value="😢">Sad 😢</option>
          <option value="😡">Angry 😡</option>
          <option value="😴">Tired 😴</option>
        </select>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What’s on your mind?"
        />
        <button onClick={addMood}>Log Mood</button>
      </div>
      {fortune && <div className="fortune">✨ Fortune: {fortune} ✨</div>}
      <h2>Past Moods</h2>
      <ul className="mood-list">
        {moods.map(m => (
          <li key={m._id}>
            {m.mood} - {m.note} <span>({new Date(m.date).toLocaleDateString()})</span>
            <div className="fortune-past">Fortune: {m.fortune}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;