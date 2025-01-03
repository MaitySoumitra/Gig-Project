import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const AddMemberModal = ({ show, handleCloseModal }) => {
  const { register, handleSubmit, reset } = useForm();
  const [members, setMembers] = useState([]); // State to hold the list of members
  const [memberCount, setMemberCount] = useState(0); // State to hold the member count
  const [showMembers, setShowMembers] = useState(false); // State to control visibility of member profiles
  useEffect(() => {
    if (show) {
      fetchMembers();
    }
  }, [show]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/member");
      setMembers(response.data);
      setMemberCount(response.data.length); // Update the count
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  // Handle form submission for adding a new member
  const onSubmit = async (data) => {
    try {
      // Add the new member
      await axios.post("http://localhost:3000/api/member", data);
      console.log("Member added successfully");

      // Reset form and close the modal
      reset();
      handleCloseModal();

      // Fetch updated members after adding a new one
      fetchMembers();

      // Set the state to show member profiles after adding
      setShowMembers(true);
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  return (
    <div
      className={`modal ${show ? "show" : ""}`}
      tabIndex="-1"
      style={{ display: show ? "block" : "none" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header d-flex align-items-center">
            <h5 className="modal-title">Add New Member</h5>
            <button
              type="button"
              className="btn-close ms-auto"
              onClick={handleCloseModal}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {/* Form for adding a new member */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  {...register("name", { required: true })}
                  placeholder="Enter member name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  {...register("email", { required: true })}
                  placeholder="Enter member email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  className="form-control"
                  id="role"
                  {...register("role", { required: true })}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select member role
                  </option>
                  <option value="Developer">Developer</option>
                  <option value="UI & UX Designer">UI & UX Designer</option>
                  
                  <option value="BA Analyst">Business Analyst (BA)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-100 mt-3">
                Add Member
              </button>
            </form>

            {/* Display the count of members and their profiles after clicking "Add Member" */}
            {showMembers && (
              <div className="member-count mt-3">
                <h5>Total Members: {memberCount}</h5>
                <div className="member-list">
                  <h6>Member Profiles:</h6>
                  {members.length > 0 ? (
                    members.map((member, index) => (
                      <div key={index} className="member-profile">
                        <p><strong>Name:</strong> {member.name}</p>
                        <p><strong>Email:</strong> {member.email}</p>
                        <p><strong>Role:</strong> {member.role}</p>
                        <hr />
                      </div>
                    ))
                  ) : (
                    <p>No members found</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
