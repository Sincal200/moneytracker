// Web Workers para realizar la tarea de carga de datos por separado del hilo principal que es la interfaz grafica
self.onmessage = async function (e) {
    const { type, payload } = e.data;
  
    switch (type) {
      case 'FETCH_TASKS':
        const tasks = await fetchTasks(payload.status);
        self.postMessage({ type: 'FETCH_TASKS_SUCCESS', tasks });
        break;
        
      default:
        break;
    }
  };

async function fetchTasks(status = '') {
    const url = status 
        ? `https://ideal-space-journey-g7jqxqqx5w6hp475-4000.app.github.dev/api/tasks/${status}`
        : 'https://ideal-space-journey-g7jqxqqx5w6hp475-4000.app.github.dev/api/tasks';
    const response = await fetch(url);
    return await response.json();
}


