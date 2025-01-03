import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const TaskModal = ({ showModal, handleCloseModal, onSubmit, currentColumnIndex, columns }) => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  
  const [members, setMembers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isMemberValid, setIsMemberValid] = useState(true); 

  useEffect(() => {
    // Fetch members when the modal is open
    fetchMembers();
  }, [showModal]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/member");
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (value.includes("@")) {
      const query = value.split("@")[1].toLowerCase();
      const filteredMembers = members.filter((member) =>
        member.name.toLowerCase().includes(query)
      );
      setSuggestions(filteredMembers);
    } else {
      setSuggestions([]);
    }
  };

  const handleMemberSelect = (member) => {
    setValue("assignedBy", member._id);  // Set member ID
    setValue("designation", member.designation);  // Set designation
    setValue("role", member.role);  // Set role automatically
    setSearchText(member.name); 
    setSuggestions([]); 
    setIsMemberValid(true); 
  };

  const validateMember = async () => {
    const memberExists = members.some((member) => member.name === searchText);
    if (!memberExists) {
      setIsMemberValid(false);
      return false;
    }
    setIsMemberValid(true);
    return true;
  };

  const handleClose = () => {
    handleCloseModal();
    reset();
    setSearchText('');
    setSuggestions([]);
    setIsMemberValid(true);
  };

  if (!showModal) return null;

  // Get the current column's title to set dynamic status options
  const currentColumn = columns[currentColumnIndex];
  const columnTitle = currentColumn ? currentColumn.title : "";

  const getStatusOptions = () => {
    if (columnTitle === "To Do") {
      return ["To Do"];
    } else if (columnTitle === "In Progress") {
      return ["In Progress"];
    } else if (columnTitle === "Verified") {
      return ["Verified"];
    } else if (columnTitle === "Completed") {
      return ["Completed"];
    } 
    else {
      return ["To Do", "In Progress", "Completed", "Verified"];
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Task</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input {...register("title", { required: true })} className="form-control" />
                {errors.title && <span className="text-danger">Title is required</span>}
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea {...register("description")} className="form-control" rows="3" />
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select {...register("status")} className="form-control">
                  {getStatusOptions().map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="d-flex gap-3 mb-3">
                <div className="flex-grow-1">
                  <label className="form-label">Start Date</label>
                  <input
                    {...register("startDate")}
                    type="date"
                    className="form-control"
                  />
                </div>
                <div className="flex-grow-1">
                  <label className="form-label">End Date</label>
                  <input
                    {...register("endDate")}
                    type="date"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Assigned By @ (Search by Name)</label>
                <input
                  type="text"
                  value={searchText}
                  onChange={handleSearchChange}
                  className="form-control"
                />
                {suggestions.length > 0 && (
                  <ul className="list-group">
                    {suggestions.map((member) => (
                      <li
                        key={member._id}
                        className="list-group-item"
                        onClick={() => handleMemberSelect(member)}
                      >
                        {member.name}
                      </li>
                    ))}
                  </ul>
                )}
                {!isMemberValid && (
                  <span className="text-danger">Member not found</span>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <input
                  {...register("role")}
                  className="form-control"
                  disabled  
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Created By</label>
                <input {...register("createdBy", { required: true })} className="form-control" />
                {errors.createdBy && <span className="text-danger">Created By is required</span>}
              </div>

              <div className="mb-3">
                <label className="form-label">Attachment</label>
                <input
                  {...register("attachment")}
                  type="file"
                  className="form-control"
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
