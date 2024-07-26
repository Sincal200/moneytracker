const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Transaction = require('./modules/Transaction.js');
const Task = require('./modules/Task.js');
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

  app.post('/api/task',async (req,res) =>{
    await mongoose.connect(process.env.MONGO_URL)
    const {title,description,status,datetime} = req.body;
    const task = await Task.create({title,description,status,datetime});

    res.json(task);
});


app.get('/api/tasks',async (req,res) =>{
    await mongoose.connect(process.env.MONGO_URL)
    const  tasks = await Task.find({});
    res.json(tasks);
});

app.get('',async (req,res) =>{
    await mongoose.connect(process.env.MONGO_URL)
    const  tasks = await Task.find({});
    res.json(tasks);
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const result = await Task.findByIdAndDelete(req.params.id);
        if (result) {
            res.status(200).json({ message: 'Task deleted successfully', _id: req.params.id });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error });
    }
});

// Update endpoint
app.put('/tasks/:id', async (req, res) => {
    try {
      const taskId = req.params.id;
      const updatedData = req.body;
  
      const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData, { new: true });
  
      if (updatedTask) {
        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating task', error: error });
    }
  });


app.listen(4000);




