import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import TaskModal from "./TaskModal"; // Import TaskModal component
import ShowColumnModal from "./ShowColumnModal"; // Import ShowColumnModal component
import AddMemberModal from "./AddMemberModal"; // Import AddMemberModal component
import "./Table.css";

const Table = () => {
  const [columns, setColumns] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [currentColumnIndex, setCurrentColumnIndex] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/ticket")
      .then((response) => {
        setColumns(response.data);
      })
      .catch((error) => {
        console.error("Error fetching columns:", error);
      });
  }, []);

  const openTaskModal = (index) => {
    setCurrentColumnIndex(index);
    setShowTaskModal(true);
  };

  const openColumnModal = () => setShowColumnModal(true);
  const openAddMemberModal = () => setShowAddMemberModal(true);

  const closeModals = () => {
    setShowTaskModal(false);
    setShowColumnModal(false);
    setShowAddMemberModal(false);
    reset(); // Reset form fields
  };

  const handleTaskSubmit = async (data) => {
    const newTask = {
      title: data.title,
      description: data.description,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
      designation: data.designation,
      attachment: data.attachment[0]?.name || "",
      assignedBy: data.assignedBy,
    };

    const token = localStorage.getItem("authToken");
    console.log(token)
    if (!token) {
      console.error("No authToken found in localStorage");
      return; // Stop the function if no token is found
    }

    try {
      const columnId = columns[currentColumnIndex]._id;

      const response = await axios.post(
        `http://localhost:3000/api/ticket/${columnId}/tasks`,
        newTask,
        {
          Authorization: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        }
      );

      setColumns(
        columns.map((column, index) =>
          index === currentColumnIndex ? response.data : column
        )
      );
      closeModals(); // Close modals after submitting the task
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleColumnSubmit = async (data) => {
    if (data.columnTitle.trim()) {
      try {
        const response = await axios.post("http://localhost:3000/api/ticket", {
          title: data.columnTitle,
        });

        setColumns([...columns, response.data]);
        closeModals(); // Close modals after adding the column
      } catch (error) {
        console.error("Error adding column:", error);
      }
    }
  };

  const handleDeleteColumn = async (columnId) => {
    try {
      await axios.delete(`http://localhost:3000/api/ticket/${columnId}`);
      setColumns(columns.filter((column) => column._id !== columnId));
    } catch (error) {
      console.error("Error deleting column:", error);
    }
  };

  const handleAddMemberSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:3000/api/member", data);
      console.log("Member added successfully:", response.data);
      closeModals(); // Close the modal after adding the member
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="row mb-4">
        {/* Add Member Button */}
        <div className="col-md-12 d-flex justify-content-start">
          <button className="btn btn-transparent" onClick={openAddMemberModal}>
            <i className="fa-solid fa-user-plus"></i> Add Member
          </button>
        </div>
      </div>

      <div className="row">
        {columns.map((column, columnIndex) => (
          <div key={column._id} className="col-md-3">
            <div className="card-header bg-warning text-white d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">{column.title}</h5>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteColumn(column._id)}
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
            <div className="card">
              <div className="card-body">
                {column.tasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="mb-3 p-2 border rounded bg-light">
                    <h6 className="mb-1">
                      <b>
                        <i className="fa-solid fa-user"></i>
                      </b>{" "}
                      {task.title}
                    </h6>
                    <hr />
                    <p>
                      <b>
                        <i className="fa-solid fa-suitcase"></i>
                      </b>{" "}
                      {task.designation}
                    </p>
                    <p>
                      <b>
                        <i className="fa-solid fa-pen-to-square"></i>
                      </b>{" "}
                      {task.status}
                    </p>
                    <p>
                      <b>
                        <i className="fa-regular fa-clock"></i>
                      </b>{" "}
                      {task.startDate}
                    </p>
                    <p>
                      <b>
                        <i className="fa-regular fa-clock"></i>
                      </b>{" "}
                      {task.endDate}
                    </p>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-success btn-sm w-100 mt-3"
                onClick={() => openTaskModal(columnIndex)}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        ))}
        <div className="col-md-3">
          <button
            className="btn btn-success w-20"
            style={{ justifyContent: "flex-start" }}
            onClick={openColumnModal}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>

      
      <TaskModal
        showTaskModal={showTaskModal}
        handleCloseModal={closeModals}
        onSubmit={handleTaskSubmit}
      />
      <ShowColumnModal
        showColumnModal={showColumnModal}
        handleCloseModal={closeModals}
        onSubmitColumn={handleColumnSubmit}
      />
    </div>
  );
};

export default Table;
