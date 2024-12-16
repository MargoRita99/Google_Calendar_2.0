import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notification = () => {
  const showError = (message) => {
    toast.error(message);
  };

  const showSuccess = (message) => {
    toast.success(message);
  };

  return (
    <div>
      <ToastContainer />
      <button onClick={() => showSuccess('Success!')}>Show Success</button>
      <button onClick={() => showError('Something went wrong!')}>Show Error</button>
    </div>
  );
};

export default Notification;