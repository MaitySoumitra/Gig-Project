import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const TaskModal = ({ showTaskModal, handleCloseModal, onSubmit }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [members, setMembers] = useState([]); 
  const [suggestions, setSuggestions] = useState([]);
  const [searchText, setSearchText] = useState(""); 
  const [isMemberValid, setIsMemberValid] = useState(true);

  useEffect(() => {
    if (showTaskModal) {
      fetchMembers();
    }
  }, [showTaskModal]);

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
    setValue("assignedBy", member.name); 
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

  const handleFormSubmit = async (data) => {
    const isMemberValid = await validateMember();
    if (isMemberValid) {
      onSubmit(data); // Trigger the parent's onSubmit function
    }
  };

  const handleModalClose = () => {
    reset();
    handleCloseModal();
    setIsMemberValid(true); 
  };

  return (
    showTaskModal && (
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Task</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleModalClose}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    className="form-control"
                    required
                  />
                  {errors.title && <p className="text-danger">{errors.title.message}</p>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    {...register("description")}
                    className="form-control"
                    rows="3"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    {...register("status", { required: "Status is required" })}
                    className="form-control"
                    required
                  >
                    <option value="To Do">Starting</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Verified">Verified</option>
                  </select>
                  {errors.status && <p className="text-danger">{errors.status.message}</p>}
                </div>

                <div className="d-flex gap-3 mb-3">
                  <div className="flex-grow-1">
                    <label className="form-label">Start Date</label>
                    <input
                      {...register("startDate", { required: "Start Date is required" })}
                      type="date"
                      className="form-control"
                      required
                    />
                    {errors.startDate && <p className="text-danger">{errors.startDate.message}</p>}
                  </div>
                  <div className="flex-grow-1">
                    <label className="form-label">End Date</label>
                    <input
                      {...register("endDate", { required: "End Date is required" })}
                      type="date"
                      className="form-control"
                      required
                    />
                    {errors.endDate && <p className="text-danger">{errors.endDate.message}</p>}
                  </div>
                </div>

                <div className="d-flex gap-3 mb-3">
                  <div className="flex-grow-1">
                    <label className="form-label">Assigned By</label>
                    <input
                      {...register("assignedBy")}
                      className="form-control"
                      value={searchText}
                      onChange={handleSearchChange}
                      placeholder="Type @ to search"
                    />
                    {suggestions.length > 0 && (
                      <ul className="suggestions-list">
                        {suggestions.map((member) => (
                          <li
                            key={member.id}
                            onClick={() => handleMemberSelect(member)}
                            className="suggestion-item"
                          >
                            {member.name}
                          </li>
                        ))}
                      </ul>
                    )}
                    {!isMemberValid && <p className="text-danger">Member not found</p>}
                  </div>
                  <div className="flex-grow-1">
                    <label className="form-label">Created By</label>
                    <input
                      {...register("createdBy")}
                      className="form-control"
                      value="Default User" 
                      readOnly
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Designation</label>
                  <input
                    {...register("designation")}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Attachment</label>
                  <input
                    {...register("attachment")}
                    type="file"
                    className="form-control"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(file);
                        link.download = file.name;
                        link.textContent = file.name;
                        document
                          .getElementById("attachment-preview")
                          .appendChild(link);
                      }
                    }}
                  />
                  <div id="attachment-preview" className="mt-2"></div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleModalClose}
                  >
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
    )
  );
};

export default TaskModal;
