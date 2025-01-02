// ColumnModal.js
import React from "react";
import { useForm } from "react-hook-form";

const ColumnModal = ({ showModal, handleCloseModal, onSubmitColumn }) => {
  const { register, handleSubmit } = useForm();

  if (!showModal) return null;

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Column</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleCloseModal}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmitColumn)}>
              <div className="mb-3">
                <label className="form-label">Select Column Title</label>
                <select {...register("columnTitle")} className="form-control" required>
                  <option value="">Select a Column Title</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Verified">Verified</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Column
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnModal;
