import React, { useState } from "react";
import { useForm } from "react-hook-form";

const UserModal = ({ showUserModal, handleCloseModal, onSubmit }) => {
  const { register, handleSubmit, reset } = useForm();
  const [userName, setUserName] = useState("");

  const onSubmitUser = (data) => {
    onSubmit({ name: userName });
    reset();
  };

  return (
    <div className={`modal ${showUserModal ? "show" : ""}`} style={{ display: showUserModal ? "block" : "none" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Member</h5>
            <button type="button" className="close" onClick={handleCloseModal}>
              <span>&times;</span>
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmitUser)}>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Enter User Name"
                className="form-control"
                {...register("name")}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
