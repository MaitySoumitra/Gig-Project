import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'; 
import gantt from 'dhtmlx-gantt';

const GanttChart = () => {
  const ganttContainer = useRef(null);
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');  // Retrieve token

  useEffect(() => {
    axios.get('http://localhost:3000/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      const tasksFromBackend = response.data.map((task) => ({
        id: task._id,
        text: task.name,
        start_date: task.start,
        duration: Math.floor((new Date(task.end) - new Date(task.start)) / (1000 * 60 * 60 * 24)),
        progress: task.progress / 100,  
        isDisabled: task.isDisabled,
        styles: {
          progressColor: task.styles?.progressColor || "#000",
          progressSelectedColor: task.styles?.progressSelectedColor || "#00f"
        },
      }));
      setTasks(tasksFromBackend);
    })
    .catch((error) => {
      console.error('Error fetching tasks:', error);
    });
  }, [token]);
  useEffect(() => {
    gantt.init(ganttContainer.current);
    gantt.attachEvent('onAfterTaskUpdate', (id, task) => {
      axios.put(`http://localhost:3000/tasks/${id}`, {
        progress: task.progress * 100, 
      })
      .then(response => {
        console.log('Task updated successfully:', response);
      })
      .catch(err => console.log('Error updating task:', err));
    });

    gantt.parse({ data: tasks });

    return () => gantt.clearAll(); 
  }, [tasks]);  

  return (
    <div>
      <h3>Task Completion Tracker</h3>
      <div ref={ganttContainer} style={{ height: '500px' }}></div>
    </div>
  );
};

export default GanttChart;
