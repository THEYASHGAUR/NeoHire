import React from "react";

const Card = ({ children }) => {
  return (
    <div className="bg-gray-800 bg-opacity-50 rounded-2xl shadow-lg p-5 relative">
      {children}
    </div>
  );
};

const CardHeader = ({ children }) => {
  return <div className="mb-4 flex items-center space-x-3">{children}</div>;
};

const CardTitle = ({ children }) => {
  return <h2 className="text-white text-lg font-semibold">{children}</h2>;
};

const CardContent = ({ children }) => {
  return <div>{children}</div>;
};

export { Card, CardHeader, CardTitle, CardContent };
