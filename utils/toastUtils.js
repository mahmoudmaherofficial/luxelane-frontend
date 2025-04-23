import { toast } from "react-toastify";

export const showErrorToast = (message) => {
  toast.error(
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <i className="fa-duotone fa-solid fa-circle-xmark" style={{ marginRight: '10px', color: '#d32f2f', fontSize: '20px' }}></i>
      <span style={{ color: 'white' }}>{message}</span>
    </div>,
    {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'dark',
      style: {
        backgroundColor: 'oklch(20.8% .042 265.755)',
        color: 'white',
        borderRadius: '10px',
      },
      progressStyle: {
        backgroundColor: 'white',
      },
      icon: false,
    }
  );
};

export const showSuccessToast = (message) => {
  toast.success(
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <i className="fa-duotone fa-solid fa-circle-check" style={{ marginRight: '10px', color: '#4caf50', fontSize: '20px' }}></i>
      <span style={{ color: 'white' }}>{message}</span>
    </div>,
    {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'dark',
      style: {
        backgroundColor: 'oklch(20.8% .042 265.755)',
        color: 'white',
        borderRadius: '10px',
      },
      progressStyle: {
        backgroundColor: 'white',
      },
      icon: false,
    }
  );
};
