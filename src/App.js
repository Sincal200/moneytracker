
import { useEffect, useState } from 'react';
import './App.css';


function App() {
  const [title,setTitle] = useState(''); 
  const [description,setDescription] = useState(''); 
  const [status,setStatus] = useState(''); 
  const [datetime,setDatetime] = useState(''); 
  const [tasks,setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [viewStatus, setViewStatus] = useState('');

  useEffect(() => {
    const worker = new Worker(new URL('./taskWorker.js', import.meta.url));
    worker.postMessage({ type: 'FETCH_TASKS', payload: { status: viewStatus } });

    worker.onmessage = function (e) {
      const { type, tasks } = e.data;
      if (type === 'FETCH_TASKS_SUCCESS') {
        setTasks(tasks);
      }
    };

    return () => {
      worker.terminate();
    };
  }, [viewStatus]);

  
  function addNewTask(ev){
    ev.preventDefault();
    const url= 'https://ideal-space-journey-g7jqxqqx5w6hp475-4000.app.github.dev/api/task';
    fetch(url,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        title,
        description,
        status,
        datetime,
      })
    }).then(response => {
      response.json().then(json => { 
        setTitle('');
        setDescription('');
        setStatus('');
        setDatetime('');
        const worker = new Worker(new URL('./taskWorker.js', import.meta.url));
        worker.onmessage = function (e) {
          const { type, tasks } = e.data;
          if (type === 'FETCH_TASKS_SUCCESS') {
            setTasks(tasks);
          }
        };
        console.log('result',json);
      });
    });
  }

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`https://ideal-space-journey-g7jqxqqx5w6hp475-4000.app.github.dev/api/tasks/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.status === 200) {
        setTasks(tasks.filter(task => task._id !== id));
        alert(data.message); 
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Failed to delete task."); 
    }
  }

  const updateTask = async (ev) => {
    ev.preventDefault();
    const url = `https://ideal-space-journey-g7jqxqqx5w6hp475-4000.app.github.dev/tasks/${editingTask._id}`;
    const updatedData = {
      title,
      description,
      status,
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
        setTasks(tasks.map(task => 
          task._id === editingTask._id ? data.task : task
        ));
        setEditingTask(null);
        setTitle('');
        setDescription('');
        setStatus('');
        setDatetime('');

        alert(data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Failed to update task.");
    }
  }

  const handleViewStatusChange = (ev) => {
    setViewStatus(ev.target.value);
  }


  const handleEditClick = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setDatetime(task.datetime);

  }

  

  return (
    <main>
      <form onSubmit={editingTask ? updateTask : addNewTask}>
      <div className='Title'>
        <h1>Task Manager</h1>
        </div>
        <div className='View'>
        <select value={viewStatus} onChange={handleViewStatusChange}>
            <option value="">All Tasks</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className='Basics'>
          <input type="text" 
          value={title}
          onChange={ev => setTitle(ev.target.value)} 
          placeholder={'New Task'}></input>
          <input value={datetime} 
          onChange={ev => setDatetime(ev.target.value)}
          type="datetime-local"></input>
        </div>
        <div className='Description'>
          <input value={description} 
          onChange={ev => setDescription(ev.target.value)}
          type="text" placeholder={'Description'}></input>
        </div>
        <div className='Status'>
          <select value={status} 
          onChange={ev => setStatus(ev.target.value)}>
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <button type='submit'>{editingTask ? 'Update Task' : 'Add new Task'}</button>
      </form>
      <div className='Tasks'>
        {tasks.length > 0 && tasks.map((task) => (
          <div key={task._id}>
            <div className='Task'>
              <div className='left'>
                <div className='title'>{task.title}</div>
                <div className='description'>{task.description}</div>
              </div>
              <div className='right'>
                <div className='datetime'>{task.datetime}</div>
                <div className={'status ' + (task.status === "Completed" ? 'green' : task.status === "In Progress" ? 'yellow' : 'red')}>
            {task.status}
          </div>
                <button onClick={() => deleteTask(task._id)}>Delete</button>
                <button onClick={() => handleEditClick(task)}>Edit</button>

              </div>
            </div>
          </div>
        ))}    
      </div>  
    </main>
  );
}

export default App;

