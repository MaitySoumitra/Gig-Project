import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Gantt, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

const initialNewTask = {
  name: '',
  start: '',
  end: '',
  progress: 0,
};

const Timeline = () => {
  const [ganttTasks, setGanttTasks] = useState([]);
  const [newTask, setNewTask] = useState(initialNewTask);

  useEffect(() => {
    axios.get('http://localhost:3000/api/tasks')
      .then(response => {
        const tasks = response.data.map(task => ({
          ...task,
          start: task.start ? new Date(task.start) : new Date(),
          end: task.end ? new Date(task.end) : new Date(),
        }));
        setGanttTasks(tasks);
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const updateProgress = (id, progress) => {
    if (progress < 0 || progress > 100) {
      console.log('Invalid progress value');
      return;
    }

    axios.put(`http:/localhost:3000/api/tasks/${id}`, { progress })
      .then(response => {
        const updatedTask = response.data;
        setGanttTasks(prevTasks => 
          prevTasks.map(task => 
            task._id === updatedTask._id ? { ...task, progress: updatedTask.progress } : task
          )
        );
      })
      .catch(error => {
        console.error('Error updating progress:', error);
      });
  };

  const addNewTask = () => {
    const { name, start, end, progress } = newTask;
    if (!name || !start || !end) {
      console.error("Please fill all the required fields.");
      return;
    }
  
    axios.post('http://localhost:3000/api/tasks', {
      name,
      start: new Date(start),
      end: new Date(end),
      progress: parseInt(progress, 10),
    })
      .then(response => {
        const newTask = {
          ...response.data,
          start: new Date(response.data.start),
          end: new Date(response.data.end),
        };
        setGanttTasks(prevTasks => [...prevTasks, newTask]); 
        setNewTask(initialNewTask); 
      })
      .catch(error => {
        console.error("Error adding new task:", error);
      });
  };
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prevState => {
      const updatedTask = { ...prevState, [name]: value };
      return updatedTask;
    });
  };
  

  return (
    <div style={{ width: '100%', height: '700px' }}>
      <h1>Web Development Project</h1>
      {ganttTasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h3>No tasks available. Please add new tasks.</h3>
        </div>
      ) : (
        <Gantt
          tasks={ganttTasks}
          viewMode={ViewMode.Day}
          customPopupHtml={(task) => {
            return `
              <div>
                <h3>${task.name}</h3>
                <p>Project Name: ${task.name}</p>
                <p>Start: ${task.start ? task.start.toLocaleDateString() : 'N/A'}</p>
                <p>End: ${task.end ? task.end.toLocaleDateString() : 'N/A'}</p>
                <p>Progress: ${task.progress}%</p>
              </div>
            `;
          }}
          onDateChange={(task, newStartDate, newEndDate) => {
            console.log(`Task ${task.name} updated. New start: ${newStartDate}, New end: ${newEndDate}`);
          }}
        />
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Add New Task</h3>
        <div>
          <input
            type="text"
            name="name"
            value={newTask.name}
            placeholder="Task Name"
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="start"
            value={newTask.start}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="end"
            value={newTask.end}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="progress"
            value={newTask.progress}
            min="0"
            max="100"
            onChange={handleInputChange}
          />
        </div>
        <button onClick={addNewTask}>Add Task</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Update Task Progress</h3>
        {ganttTasks.map((task) => (
          <div key={task._id || `${task.name}-${task.start.toISOString()}`}>
            <label>{task.name} Progress:</label>
            <input
              type="number"
              value={task.progress}
              min="0"
              max="100"
              onChange={(e) => updateProgress(task._id, parseInt(e.target.value, 10))}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
