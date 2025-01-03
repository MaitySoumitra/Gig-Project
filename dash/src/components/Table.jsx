import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import TaskModal from "./TaskModal";
import ShowColumnModal from "./ShowColumnModal";
import "./Table.css";

const Table = () => {
  const [columns, setColumns] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [currentColumnIndex, setCurrentColumnIndex] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    axios.get("http://localhost:3000/api/ticket").then((response) => {
      setColumns(response.data);
    });
  }, []);

  const handleOpenTaskModal = (index) => {
    setCurrentColumnIndex(index);
    setShowTaskModal(true);
  };

  const handleOpenColumnModal = () => {
    setShowColumnModal(true);
  };

  const handleCloseModal = () => {
    setShowTaskModal(false);
    setShowColumnModal(false);
    reset();
  };

  const onSubmit = async (data) => {
    const taskData = {
      title: data.title,
      description: data.description,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
      assignedBy: data.assignedBy,  
      designation: data.designation,
      createdBy: data.createdBy,
    };
    if (data.attachment[0]) {
      taskData.attachment = data.attachment[0];
    }

    try {
      await axios.post(
        `http://localhost:3000/api/ticket/${columns[currentColumnIndex]._id}/tasks`,
        taskData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const response = await axios.get("http://localhost:3000/api/ticket");
      setColumns(response.data);
      handleCloseModal();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const onSubmitColumn = async (data) => {
    const columnTitle = data.columnTitle.trim();

    const isDuplicate = columns.some(
      (column) => column.title.toLowerCase() === columnTitle.toLowerCase()
    );

    if (isDuplicate) {
      alert("A column with this name already exists. Please choose a different name.");
      return;
    }

    if (columnTitle) {
      const newColumn = { title: columnTitle, tasks: [] };
      await axios.post("http://localhost:3000/api/ticket", newColumn);

      const response = await axios.get("http://localhost:3000/api/ticket");
      setColumns(response.data);
      handleCloseModal();
    }
  };

  const handleDeleteColumn = async (columnId) => {
    await axios.delete(`http://localhost:3000/api/ticket/${columnId}`);
    const response = await axios.get("http://localhost:3000/api/ticket");
    setColumns(response.data);
  };

 const handleStatusChange = async (taskId, newStatus, columnIndex) => {
  const updatedColumns = [...columns];
  const currentColumn = updatedColumns[columnIndex];
  const task = currentColumn.tasks.find((task) => task._id === taskId);
  const columnId = currentColumn._id;
  
  if (!columnId) {
    console.error("columnId is missing or undefined");
    return;
  }
  task.status = newStatus;
  const targetColumnIndex = updatedColumns.findIndex(
    (column) => column.title.toLowerCase() === newStatus.toLowerCase()
  );

  if (targetColumnIndex !== -1) {
    currentColumn.tasks = currentColumn.tasks.filter((task) => task._id !== taskId);
    const targetColumn = updatedColumns[targetColumnIndex];
    targetColumn.tasks.push(task);
  }

  setColumns(updatedColumns);

  try {
    console.log('Updating task status for taskId:', taskId, 'newStatus:', newStatus, 'columnId:', columnId);

    const response = await axios.put(
      `http://localhost:3000/api/ticket/${columnId}/tasks/${taskId}/status`,
      { status: newStatus },
      { headers: { "Content-Type": "application/json" } }
    );
    const updatedColumnsResponse = await axios.get("http://localhost:3000/api/ticket");
    setColumns(updatedColumnsResponse.data); 

  } catch (error) {
    console.error("Error updating task status:", error);
    task.status = task.prevStatus; 
    setColumns(updatedColumns);
  }
};
  return (
    <div className="container-fluid p-4">
      <div className="row">
        {columns.map((column, columnIndex) => (
          <div key={column.id} className="col-md-3">
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
                  <div
                    key={taskIndex}
                    className="mb-3 p-2 border rounded bg-light"
                  >
                    <h6 className="mb-1">
                      <b>
                        <i className="fa-solid fa-paste"></i>
                      </b>{" "}
                      {task.title}
                    </h6>
                    <hr />

                    <p>
                      <b>
                        <i className="fa-solid fa-user"></i>
                      </b>{" "}
                      {task.assignBy}
                    </p>
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
                      {task.isEditingStatus ? (
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(task._id, e.target.value, columnIndex) 
                          }
                          className="form-select form-select-sm"
                        >
                          <option value="Verified">Verified</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="To Do">To Do</option>
                        </select>
                      ) : (
                        <>
                          {task.status}
                          <button
                            className="btn btn-sm btn-primary ml-2"
                            onClick={() => {
                              task.isEditingStatus = !task.isEditingStatus;
                              setColumns([...columns]); 
                            }}
                          >
                            <i className="fa-solid fa-edit"></i>
                          </button>
                        </>
                      )}
                    </p>


                    <div className="d-flex justify-content-between">
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

                    <p>
                      <b>
                        <i className="fa-solid fa-pen-clip"></i>
                      </b>{" "}
                      {task.createBy}
                    </p>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-success btn-sm w-100 mt-3"
                onClick={() => handleOpenTaskModal(columnIndex)}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        ))}

        {columns.length < 4 && (
          <div className="col-md-3">
            <button
              className="btn btn-success w-20"
              style={{ justifyContent: "flex-start" }}
              onClick={handleOpenColumnModal}
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
        )}
      </div>
      <TaskModal
        showModal={showTaskModal}
        handleCloseModal={handleCloseModal}
        onSubmit={onSubmit}
        currentColumnIndex={currentColumnIndex}
        columns={columns}
      />
      <ShowColumnModal
        showModal={showColumnModal}
        handleCloseModal={handleCloseModal}
        onSubmitColumn={onSubmitColumn}
      />
    </div>
  );
};

export default Table;
