import React from "react";

const Progress = ({ value }) => {
  return (
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div
        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export { Progress };
