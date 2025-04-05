import React from "react";

const Input = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 rounded-xl shadow-md bg-gray-700 text-white border-none focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
};

export { Input };
