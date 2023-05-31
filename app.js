const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbUri = "mongodb+srv://<username>:<password>@cluster0.pfvqylq.mongodb.net/";

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas', error);
  });

const flashcardSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

// Create a new flashcard
app.post('/flashcards', (req, res) => {
  const { question, answer } = req.body;

  const flashcard = new Flashcard({ question, answer });
  flashcard.save()
    .then(() => {
      res.status(201).json(flashcard);
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Get all flashcards
app.get('/flashcards', (req, res) => {
  Flashcard.find()
    .then((flashcards) => {
      res.json(flashcards);
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Delete a flashcard
app.delete('/flashcards/:id', (req, res) => {
  const { id } = req.params;

  Flashcard.findByIdAndDelete(id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred' });
    });
});
