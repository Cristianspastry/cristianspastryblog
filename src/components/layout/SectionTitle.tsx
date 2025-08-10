import React from "react";

interface SectionTitleProps {
  children: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => (
  <h2 className="flex items-center  font-bold  text-3xl md:text-4xl font-serif text-blue-900 mb-8">
    <span className="block w-2 h-7 bg-orange-400 rounded-r mr-2"></span>
    {children}
  </h2>


);

export default SectionTitle; 