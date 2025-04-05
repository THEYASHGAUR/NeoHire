import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { FaDownload, FaEnvelope, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Select from 'react-select';

const candidates = [
  { name: "Jane Smith", skills: "React, Express.js", experience: "3 years", location: "San Francisco", matchScore: 87 },
  { name: "Mark Wilson", skills: "Vue, Firebase", experience: "4 years", location: "Los Angeles", matchScore: 81 },
  { name: "Emily Davis", skills: "Angular, TypeScript, MySQL", experience: "6 years", location: "Chicago", matchScore: 95 },
  { name: "Michael Brown", skills: "React Native, Redux", experience: "4 years", location: "Boston", matchScore: 89 },
  { name: "Sarah Taylor", skills: "Java, Spring Boot, PostgreSQL", experience: "7 years", location: "Seattle", matchScore: 94 },
  { name: "David Johnson", skills: "Python, Django, AWS", experience: "5 years", location: "Austin", matchScore: 90 },
  { name: "Laura White", skills: "Ruby on Rails, GraphQL", experience: "4 years", location: "Denver", matchScore: 85 },
  { name: "James Miller", skills: "PHP, Laravel, MariaDB", experience: "6 years", location: "Miami", matchScore: 88 },
  { name: "Sophia Martinez", skills: "Kotlin, Android Development", experience: "3 years", location: "Phoenix", matchScore: 83 },
  { name: "Daniel Garcia", skills: "Swift, iOS Development", experience: "5 years", location: "Philadelphia", matchScore: 91 },
  { name: "Olivia Harris", skills: "C#, .NET Core, Azure", experience: "6 years", location: "Dallas", matchScore: 93 },
  { name: "William Clark", skills: "Go, Kubernetes, Docker", experience: "4 years", location: "San Diego", matchScore: 87 }
];

const matchedKeywords = [
  { resume: "Jane Smith", keywords: ["React", "Express.js", "JavaScript"] },
  { resume: "Mark Wilson", keywords: ["Vue", "Firebase", "JavaScript"] },
  { resume: "Emily Davis", keywords: ["Angular", "TypeScript", "MySQL"] },
  { resume: "David Johnson", keywords: ["Python", "Django", "AWS"] },
];

const exportDataAsFile = (data, filename) => {
  // Format data for export
  const formattedData = data.map((candidate, index) => ({
    Rank: index + 1,
    Name: candidate.name,
    Experience: candidate.experience,
    Skills: candidate.skills,
    Location: candidate.location,
    'Match Score': `${candidate.matchScore}%`
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered_Candidates");
  const csvContent = XLSX.write(workbook, { bookType: "csv", type: "array" });
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
};

const ExportButton = ({ data, filename }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => exportDataAsFile(data, filename)}
        className="bg-yellow-600 px-3 py-1 rounded-lg text-white flex items-center gap-1 transition-colors hover:bg-yellow-700"
      >
        <FaDownload /> Export CSV ({data.length})
      </button>
    </div>
  );
};

const JobMatching = () => {
  const [selectedFilters, setSelectedFilters] = useState({ skills: [], experience: "", location: "", matchScore: "" });
  const [filteredCandidates, setFilteredCandidates] = useState(candidates);

  useEffect(() => {
    const filtered = candidates.filter(candidate => {
      const skillMatch = selectedFilters.skills.length === 0 || selectedFilters.skills.every(skill => candidate.skills.toLowerCase().includes(skill.value.toLowerCase()));
      const locationMatch = !selectedFilters.location || candidate.location === selectedFilters.location;
      const experienceMatch = !selectedFilters.experience || candidate.experience.includes(selectedFilters.experience);
      const matchScoreMatch = !selectedFilters.matchScore || candidate.matchScore >= parseInt(selectedFilters.matchScore, 10);
      
      return skillMatch && locationMatch && experienceMatch && matchScoreMatch;
    });
    
    setFilteredCandidates(filtered);
  }, [selectedFilters]);

  // Update filter handler
  const handleFilterChange = (filterKey, value) => {
    setSelectedFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  const skillOptions = [
    { value: 'React', label: 'React' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'Vue', label: 'Vue' },
    { value: 'Angular', label: 'Angular' },
    { value: 'Express.js', label: 'Express.js' },
    { value: 'Python', label: 'Python' },
    { value: 'Java', label: 'Java' },
    { value: 'Ruby on Rails', label: 'Ruby on Rails' },
    { value: 'Go', label: 'Go' }
  ];

  return (
    //Main Container
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      {/* Back Button */}
      <Link 
        to="/"
        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 group transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
        Back to Dashboard
      </Link>

      <motion.div className="text-center mb-12 relative">
        <h1 className="text-5xl font-bold text-blue-400">Smart Matching, Smarter Hiring</h1>
        <p className="text-gray-400 mt-4">Upload resumes & job descriptions. Our AI will analyze, match, and rank candidates instantly.</p>
      </motion.div>

       {/* Stats Section with Glow Effect */}
       <div className="grid grid-cols-3 gap-4 mb-10">
        {["Total Resumes ", "Matched Resumes", "Unmatched Resumes"].map((title, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow-lg relative overflow-hidden"
            whileHover={{ scale: 1.04 }}
          >
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-3xl text-blue-400">{["1,235", "892", "343"][index]}</p>
            <div className="absolute inset-0 bg-blue-400 opacity-10 blur-2xl"></div>
          </motion.div>
        ))}
      </div>

      {/* Main Section Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Candidates Table */}
        <motion.div className="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg overflow-hidden" whileHover={{ scale: 1.02 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold leading-none text-gray-900 dark:text-white">
            Candidates
          </h2>
          <ExportButton 
            data={filteredCandidates} 
            filename="Candidate_Match_Results" 
          />
        </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-2">Rank</th>
                <th className="p-2">Candidate</th>
                <th className="p-2">Experience</th>
                <th className="p-2">Skills</th>
                <th className="p-2">Location</th>
                <th className="p-2">Match %</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate, index) => (
                <motion.tr key={index} className="border-b border-gray-700" whileHover={{ 
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                  scale: 1.01,
                  transition: { duration: 0.2 }
                }}
                initial={false}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{candidate.name}</td>
                  <td className="p-2">{candidate.experience}</td>
                  <td className="p-2">{candidate.skills}</td>
                  <td className="p-2">{candidate.location}</td>
                  <td className="p-2">{candidate.matchScore}%</td>
                  <td className="p-2 flex gap-2">
                    <button className="bg-green-600 px-3 py-1 rounded-lg text-white flex items-center gap-1"><FaEnvelope /> Invite</button>
                    <button className="bg-blue-600 px-3 py-1 rounded-lg text-white flex items-center gap-1"><FaDownload /> View Profile</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Right Side Column - Filters & Charts */}
        <div className="flex flex-col gap-6">
          {/* Filters Section */}
          <motion.div className="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg overflow-hidden" whileHover={{ scale: 1.02 }}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <FaSearch /> Filters {filteredCandidates.length > 0 && `(${filteredCandidates.length} results)`}
            </h2>
            
            <Select
              isMulti
              name="skills"
              options={skillOptions}
              className="basic-multi-select mb-3"
              classNamePrefix="selectn"
              onChange={(selectedOptions) => handleFilterChange("skills", selectedOptions)}
              value={selectedFilters.skills}
              placeholder="Skills"
              noOptionsMessage={() => "No skills found"}
            />  

           

            <select 
              className="w-full p-2 mb-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onChange={(e) => handleFilterChange("experience", e.target.value)}
              value={selectedFilters.experience}
            >
              <option value="">Experience</option>
              <option value="1 years">1 Years</option>
              <option value="2 years">2 Years</option>
              <option value="3 years">3 Years</option>
              <option value="4 years">4 Years</option>
              <option value="5 years">5 Years</option>
              <option value="6 years">6 Years</option>
              <option value="7 years">7 Years</option>
            </select>

            <select 
              className="w-full p-2 mb-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onChange={(e) => handleFilterChange("location", e.target.value)}
              value={selectedFilters.location}
            >
              <option value="">Location</option>
              <option value="San Francisco">San Francisco</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Chicago">Chicago</option>
              <option value="Boston">Boston</option>
              <option value="Seattle">Seattle</option>
              <option value="Austin">Austin</option>
              <option value="Denver">Denver</option>
              <option value="Miami">Miami</option>
              <option value="Phoenix">Phoenix</option>
            </select>

            <select 
              className="w-full p-2 mb-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onChange={(e) => handleFilterChange("matchScore", e.target.value)}
              value={selectedFilters.matchScore}
            >
              <option value="">Match Score</option>
              <option value="80">80% and above</option>
              <option value="85">85% and above</option>
              <option value="90">90% and above</option>
              <option value="95">95% and above</option>
            </select>

            {/* Reset Filters Button */}
            {Object.values(selectedFilters).some(value => value) && (
              <button
                onClick={() => setSelectedFilters({ skills: [], experience: "", location: "", matchScore: "" })}
                className="w-full mt-2 p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </motion.div>

          <motion.div
            className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-700"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Keyword Matches from JD</h3>
            
            {/* Content */}
            {matchedKeywords && matchedKeywords.length > 0 ? (
              <ul className="space-y-3">
                {matchedKeywords.map((match, index) => (
                  <li key={index} className="flex items-center gap-2 p-3 rounded-md bg-gray-200 dark:bg-gray-700">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow flex items-center whitespace-nowrap">
                      Resume {index + 1}
                    </span>
                    <p className="text-gray-800 dark:text-gray-300">
                      <strong className="text-gray-900 dark:text-white">Matched Keywords:</strong> {match.keywords.join(", ")}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No matches found. Please upload a different job description.</p>
            )}
          </motion.div>

          {/* Match Trends Chart */}
          <motion.div 
            className="bg-white dark:bg-gray-800 p-6 rounded-lg" 
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-lg font-semibold mb-4">Match Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={candidates} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip contentStyle={{ backgroundColor: "#333", color: "#fff" }} />
                <Legend wrapperStyle={{ color: "#fff" }} />
                <Line 
                  type="monotone" 
                  dataKey="matchScore" 
                  stroke="#82ca9d" 
                  strokeWidth={2} 
                  dot={{ r: 6, fill: "#82ca9d" }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JobMatching;
