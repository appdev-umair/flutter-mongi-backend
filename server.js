const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const ObjectId = mongoose.Types.ObjectId; // Import ObjectId from mongoose

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());  // Add this line to enable CORS

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/crud');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

// Define a schema
const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  category: String,
  date: Date,
});

const Expense = mongoose.model('Expense', expenseSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/expenses', async (req, res) => {
  const newExpense = new Expense(req.body);
  try {
    const savedExpense = await newExpense.save();
    res.status(201).send(savedExpense);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).send(expenses);
  } catch (err) {
    res.status(500).send(err);
  }
});

// DELETE endpoint for expenses
app.delete('/expenses/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Convert id to ObjectId
    const expenseId = new ObjectId(id);

    // Delete expense by ObjectId
    const result = await Expense.findByIdAndDelete(expenseId);

    if (result) {
      res.status(200).json({ message: 'Expense deleted successfully' });
    } else {
      res.status(404).json({ error: 'Expense not found' });
    }
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
