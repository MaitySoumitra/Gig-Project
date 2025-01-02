import React, { useState, useEffect } from "react";
import './leaderboard.css';
import axios from 'axios';
import { Bar, Line, Pie } from "react-chartjs-2";
import TaskStatusCard from "./TaskStatusCard";
import AddMemberModal from "./AddMemberModal";
// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Leaderboard = () => {
  const [statusCount, setStatusCount] = useState({
    todo: 0,
    inProgress: 0,
    completed: 0,
    verified: 0,
  });

  const [taskData, setTaskData] = useState([]); // For storing task data from the API
  const [showModal, setShowModal] = useState(false);
  const [members, setMembers] = useState([]); 
  const [roles, setRoles] = useState([]);
  const [roleGroupedTasks, setRoleGroupedTasks] = useState({});
  
  const pieData = {
    labels: ["Completed", "In Progress", "To Do", "Verified"],
    datasets: [
      {
        label: "Project Status",
        backgroundColor: ["#28a745", "#ffc107", "#dc3545", "#007bff"],
        data: [
          statusCount.completed,
          statusCount.inProgress,
          statusCount.todo,
          statusCount.verified,
        ],
      },
    ],
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    const fetchTasksAndRoles = async () => {
      try {
        // Fetch task data
        const taskResponse = await axios.get('http://localhost:3000/api/ticket');
        const columns = taskResponse.data;
        setTaskData(columns);
 
        // Count the task statuses
        const counts = columns.reduce((acc, column) => {
          column.tasks.forEach(task => {
            if (task.status === 'To Do') acc.todo++;
            if (task.status === 'In Progress') acc.inProgress++;
            if (task.status === 'Completed') acc.completed++;
            if (task.status === 'Verified') acc.verified++;
          });
          return acc;
        }, { todo: 0, inProgress: 0, completed: 0, verified: 0 });
 
        setStatusCount(counts);
 
        // Fetch roles from the Member model (distinct roles)
        const roleResponse = await axios.get('http://localhost:3000/api/ticket/roles');
        const fetchedRoles = roleResponse.data;
        setRoles(fetchedRoles); // Set roles dynamically
 
      } catch (error) {
        console.error('Error fetching tasks or roles:', error);
      }
    };
 
    fetchTasksAndRoles();
  }, []);
 
  // Group tasks by role and member (avoid duplicates)
  useEffect(() => {
    if (roles.length === 0 || taskData.length === 0) return;
 
    const grouped = roles.reduce((acc, role) => {
      acc[role] = {}; // Each role will have a dictionary of members as keys
      return acc;
    }, {});
 
    taskData.forEach(column => {
      column.tasks.forEach(task => {
        const role = task.assignedBy ? task.assignedBy.role : 'Unknown';
        const memberName = task.assignedBy ? task.assignedBy.name : 'Unknown';
 
        if (roles.includes(role)) {
          // Initialize member data if not already done
          if (!grouped[role][memberName]) {
            grouped[role][memberName] = {
              todo: 0,
              inProgress: 0,
              completed: 0,
              verified: 0,
              totalTasks: 0,
              duration: 0,
            };
          }
 
          // Aggregate task counts by member
          if (task.status === 'To Do') grouped[role][memberName].todo++;
          if (task.status === 'In Progress') grouped[role][memberName].inProgress++;
          if (task.status === 'Completed') grouped[role][memberName].completed++;
          if (task.status === 'Verified') grouped[role][memberName].verified++;
 
          // Add task duration and increment total task count
          grouped[role][memberName].duration += task.duration || 0;
          grouped[role][memberName].totalTasks++;
        }
      });
    });
 
    setRoleGroupedTasks(grouped);
  }, [roles, taskData]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/member');
        setMembers(response.data); 
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();  
  }, []);

  const groupTasksByMember = () => {
    const memberTasks = {};

    taskData.forEach(column => {
      column.tasks.forEach(task => {
        const memberName = task.assignedBy ? task.assignedBy.name : 'Unknown';

        if (!memberTasks[memberName]) {
          memberTasks[memberName] = {
            todo: 0,
            inProgress: 0,
            completed: 0,
            verified: 0,
            totalTasks: 0,
            duration: 0
          };
        }

        if (task.status === 'To Do') memberTasks[memberName].todo++;
        if (task.status === 'In Progress') memberTasks[memberName].inProgress++;
        if (task.status === 'Completed') memberTasks[memberName].completed++;
        if (task.status === 'Verified') memberTasks[memberName].verified++;
        memberTasks[memberName].duration += task.duration || 0;
        memberTasks[memberName].totalTasks++;
      });
    });

    return memberTasks;
  };

  function getRandomColor() {
    const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6610f2'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  const memberGroupedTasks = groupTasksByMember();

  return (
    <div>
      <div className="button-container">
        <div className="members-container">
          {members.slice(0, 4).map((member, index) => (
            <div
              key={index}
              className={`member-logo ${index < 3 ? 'overlap' : ''}`}
              style={{ backgroundColor: getRandomColor() }}
            >
              <span className="member-initial">{member.name.charAt(0)}</span>
            </div>
          ))}
          {members.length > 4 && (
            <div className="member-total">
              +{members.length - 4}
            </div>
          )}
        </div>

        <button className="add-member-btn" onClick={handleShowModal}>
          <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
          Add Member
        </button>
      </div>

      <AddMemberModal
        show={showModal}        // Show the modal when this is true
        handleCloseModal={handleCloseModal}  // Close the modal when this function is called
      />
      <div className="container mt-4">
        <div className="row">
          <TaskStatusCard statusCount={statusCount} />
        </div>
      </div>

      <div className="container mt-4">
        <div className="row">
          {/* Loop through roles and display the respective table for each role */}
          {roles.length > 0 && Object.entries(roleGroupedTasks).map(([role, memberTasks]) => (
            <div className="col-md-6 mb-4" key={role}>
              <div className="card">
                <div className="card-header">{role} Table</div>
                <div className="card-body">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>To Do</th>
                        <th>In Progress</th>
                        <th>Verified</th>
                        <th>Completed</th>
                        <th>Total Tasks</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(memberTasks).length === 0 ? (
                        <tr><td colSpan="7">No tasks available for this role</td></tr>
                      ) : (
                        // Mapping through member data and displaying each member's tasks
                        Object.entries(memberTasks).map(([memberName, taskSummary], taskIndex) => (
                          <tr key={taskIndex}>
                            <td>{memberName}</td>
                            <td>{taskSummary.todo}</td>
                            <td>{taskSummary.inProgress}</td>
                            <td>{taskSummary.verified}</td>
                            <td>{taskSummary.completed}</td>
                            <td>{taskSummary.totalTasks}</td>
                            <td>{taskSummary.duration}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}

          {/* Pie Chart */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">Project Status Distribution</div>
              <div className="card-body">
                <Pie
                  data={pieData}
                  options={{ maintainAspectRatio: false }}
                  height={300}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
