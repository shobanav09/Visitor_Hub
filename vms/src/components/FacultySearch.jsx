import React, { useState } from "react";

const FacultySearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchFaculty = async (searchTerm) => {
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/faculty/search?name=${searchTerm}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchFaculty(value); // Fetch matching faculty names
  };

  const handleSelect = (name) => {
    setQuery(name); // Set selected faculty name in input
    setSuggestions([]); // Hide suggestions after selection
  };

  return (
    <div style={{ width: "300px", position: "relative" }}>
      <input
        type="text"
        placeholder="Search Faculty..."
        value={query}
        onChange={handleChange}
        style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            width: "100%",
            background: "white",
            border: "1px solid #ccc",
            listStyle: "none",
            padding: "0",
            margin: "0",
            borderRadius: "5px",
            maxHeight: "150px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((faculty) => (
            <li
              key={faculty.id}
              onClick={() => handleSelect(faculty.name)}
              style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #eee" }}
            >
              {faculty.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FacultySearch;
