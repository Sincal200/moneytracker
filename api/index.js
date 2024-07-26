const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Transaction = require('./modules/Transaction.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());
app.get('/api/test',(req,res) =>{
    res.json('test ok5')
});


app.post('/api/transaction',async (req,res) =>{
    await mongoose.connect(process.env.MONGO_URL)
    const {name,description,datetime,price} = req.body;
    const transaction = await Transaction.create({name,description,datetime,price});

    res.json(transaction);
});


app.get('/api/transactions',async (req,res) =>{
    await mongoose.connect(process.env.MONGO_URL)
    const  transactions = await Transaction.find({});
    res.json(transactions);
});

app.get('',async (req,res) =>{
    await mongoose.connect(process.env.MONGO_URL)
    const  transactions = await Transaction.find({});
    res.json(transactions);
});

app.delete('/api/transactions/:id', async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const result = await Transaction.findByIdAndDelete(req.params.id);
        if (result) {
            res.status(200).json({ message: 'Transaction deleted successfully', _id: req.params.id });
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting transaction', error: error });
    }
});

// Update endpoint
app.put('/transactions/:id', async (req, res) => {
    try {
      const transactionId = req.params.id;
      const updatedData = req.body;
  
      const updatedTransaction = await Transaction.findByIdAndUpdate(transactionId, updatedData, { new: true });
  
      if (updatedTransaction) {
        res.status(200).json({ message: 'Transaction updated successfully', transaction: updatedTransaction });
      } else {
        res.status(404).json({ message: 'Transaction not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating transaction', error: error });
    }
  });


app.listen(4000);




