import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const TaskStatusCard = () => {
  const [taskData, setTaskData] = useState([]);
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/ticket"); 
        
        setTaskData(response.data);
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };

    fetchTaskData();
  }, []);

  const filterTasksByDate = (tasks) => {
    const thirtyDaysAgo = moment().subtract(30, "days").toDate();
    return tasks.filter((task) => moment(task.startDate).isAfter(thirtyDaysAgo));
  };
  const countTasksByStatus = (tasks) => {
    const statusCount = {
      "To Do": 0,
      "In Progress": 0,
      "Verified": 0,
      "Completed": 0,
    };

    tasks.forEach((task) => {
      if (statusCount[task.status] !== undefined) {
        statusCount[task.status]++;
      }
    });

    return statusCount;
  };
  const getStatusCounts = () => {
    const allTasks = taskData.flatMap((column) => filterTasksByDate(column.tasks));
    return countTasksByStatus(allTasks);
  };

  const statusCounts = getStatusCounts();
  const getColor = (status) => {
    switch (status) {
      case "To Do":
        return "bg-secondary";  
      case "Completed":
        return "bg-success";  
      case "In Progress":
        return "bg-info";  
      case "Verified":
        return "bg-primary";  
      default:
        return "bg-light";  // Default light color
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {["To Do", "In Progress", "Verified", "Completed"].map((status, index) => (
          <div className="col-md-6 col-lg-3" key={index}>
            <div className={`card text-white mb-3 ${getColor(status)}`}>
              <div className="card-body">
                <h5 className="card-title">
                  {statusCounts[status]} {status} 
                </h5>
                <p className="card-text">Last 30 days</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskStatusCard;
