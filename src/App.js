
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [name,setName] = useState(''); 
  const [datetime,setDatetime] = useState(''); 
  const [description,setDescription] = useState(''); 
  const [transactions,setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    getTransactions().then(setTransactions);
  },[]);

  async function getTransactions(){
    const url='https://ideal-space-journey-g7jqxqqx5w6hp475-4000.app.github.dev/';
    const response = await fetch(url);
    return await response.json();

  }
  
  function addNewTransaction(ev){
    ev.preventDefault();
    const url= 'https://ideal-space-journey-g7jqxqqx5w6hp475-4000.app.github.dev/api/transaction';
    const price = name.split(' ')[0];
    fetch(url,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        price: price,
        name: name.substring(price.length+1),
        description,
        datetime,
      })
    }).then(response => {
      response.json().then(json => { 
        setName('');
        setDatetime('');
        setDescription('');
        getTransactions().then(setTransactions);
        console.log('result',json);
        
      });
    });
  }

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`https://ideal-space-journey-g7jqxqqx5w6hp475-4000.app.github.dev/api/transactions/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.status === 200) {
        // Remove the transaction from the state
        setTransactions(transactions.filter(transaction => transaction._id !== id));
        alert(data.message); // Optional: Notify the user
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      alert("Failed to delete transaction."); // Optional: Notify the user
    }
  }

  // New function to handle updating a transaction
  const updateTransaction = async (ev) => {
    ev.preventDefault();
    const url = `https://ideal-space-journey-g7jqxqqx5w6hp475-4000.app.github.dev/transactions/${editingTransaction._id}`;
    const price = name.split(' ')[0];
    const updatedData = {
      price: price,
      name: name.substring(price.length + 1),
      description,
      datetime,
    };
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();
      if (response.status === 200) {
        setTransactions(transactions.map(transaction => 
          transaction._id === editingTransaction._id ? data.transaction : transaction
        ));
        setEditingTransaction(null);
        setName('');
        setDatetime('');
        setDescription('');
        alert(data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Failed to update transaction:", error);
      alert("Failed to update transaction.");
    }
  }

  // Function to handle edit button click
  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setName(`${transaction.price} ${transaction.name}`);
    setDatetime(transaction.datetime);
    setDescription(transaction.description);
  }

  let balance = 0;
  for(const transaction of transactions){
    balance = balance + transaction.price;
  }

  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];

  balance = balance.split('.')[0];
  return (
    <main>
      <h1>{balance}<span>{fraction}</span></h1>
      <form onSubmit={editingTransaction ? updateTransaction : addNewTransaction}>
        <div className='Basics'>
          <input type="text" 
          value={name}
          onChange={ev => setName(ev.target.value)} 
          placeholder={'+200 new samsung TV'}></input>
          <input value={datetime} 
          onChange={ev => setDatetime(ev.target.value)}
          type="datetime-local"></input>
        </div>
        <div className='Description'>
          <input value={description} 
          onChange={ev => setDescription(ev.target.value)}
          type="text" placeholder={'Description'}></input>
        </div>
        <button type='submit'>{editingTransaction ? 'Update Transaction' : 'Add new Transaction'}</button>
      </form>
      <div className='Transactions'>
        {transactions.length > 0 && transactions.map((transaction) => (
          <div key={transaction._id}>
            <div className='Transaction'>
              <div className='left'>
                <div className='name'>{transaction.name}</div>
                <div className='description'>{transaction.description}</div>
              </div>
              <div className='right'>
                <div className={'price ' + (transaction.price < 0 ? 'red' : 'green')}>
                  {transaction.price}
                </div>
                <button onClick={() => deleteTransaction(transaction._id)}>Delete</button>
                <button onClick={() => handleEditClick(transaction)}>Edit</button>
              </div>
            </div>
          </div>
        ))}    
      </div>  
    </main>
  );
}

export default App;

