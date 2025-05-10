import React from "react";

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full opacity-70 bg-slate-900 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <i className="fa-duotone fa-solid fa-spinner animate-spin text-slate-100 text-4xl mb-4"></i>
        <p className="text-slate-100 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
