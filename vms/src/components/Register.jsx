import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MdOutlineSpeakerNotes } from "react-icons/md";

function Register() {
  const { passno } = useParams();
  console.log("Fetching visitor with passno:", passno);

  // Initial state for form data
  const [formData, setFormData] = useState({
    suggestions: [],
    template: "Visitor",
    passno: passno,
    firstname: "",
    lastname: "",
    company: "",
    mobile: "",
    emailid: "",
    addressline1: "",
    addressline2: "",
    city: "",
    accompanyingvisitors: "",
    pin: "",
    image: null,
    purpose: "",
    area: "",
    valid: "",
    remarks: "",
    vehicleNo: "",
    idType: "Aadhar Card",
    idNo: "",
    ToMeet: "",
    department: "CTS",
    spl: ""
  });

  const [isCapturing, setIsCapturing] = useState(false);
  const [loading, setLoading] = useState(false);  // To show loading during API calls
  const inputRefs = useRef([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Fetch visitor data when component mounts
    axios
      .get(`http://localhost:3000/visitor/${passno}`)
      .then(response => {
        console.log("Visitor data:", response.data);
        setFormData(prevData => ({
          ...prevData,
          ...response.data  // Merge the fetched data into formData
        }));
      })
      .catch(error => {
        console.error("Error fetching visitor data:", error);
      });
  }, [passno]);

  // Change `query` to `formData.ToMeet`
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prevData => ({
    ...prevData,
    [name]: value
  }));

  if (name === "ToMeet") {
    fetchFaculty(value);  // Fetch matching faculty names
  }
};


  // Function to fetch faculty suggestions based on search term
  const fetchFaculty = async (searchTerm) => {
    if (!searchTerm) {
      setFormData(prevData => ({ ...prevData, suggestions: [] }));
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/faculty/search?name=${searchTerm}`
      );
      const data = await response.json();
      setFormData(prevData => ({ ...prevData, suggestions: data }));
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    }
  };

  // Handle selection of a suggestion
  const handleSelect = (facultyName) => {
    setFormData(prevData => ({
      ...prevData,
      ToMeet: facultyName,  // Set the selected faculty name to ToMeet field
      suggestions: []       // Clear suggestions after selection
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);  // Set loading state to true while updating
    axios
      .put(`http://localhost:3000/visitor/${formData.passno}`, formData)  // Ensure correct endpoint URL
      .then(res => {
        console.log("Visitor updated successfully:", res.data);
        setLoading(false);  // Reset loading state after success
        alert("Visitor updated successfully");
      })
      .catch(err => {
        console.error("Error updating visitor:", err);
        setLoading(false);  // Reset loading state after error
        alert("Error updating visitor");
      });
};


  const startCamera = async () => {
    setIsCapturing(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setFormData(prevState => ({
      ...prevState,
      image: canvas.toDataURL("image/png")
    }));
    video.srcObject.getTracks().forEach(track => track.stop());
    setIsCapturing(false);
  };

  return (
    <div className="ml-[200px] mr-[200px]">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-5 p-2 border mt-2 bg-white">
            <div className="flex flex-col w-[40%]">
              <label>View Template <span className="text-[var(--color)]">*</span></label>
              <select
                className="border"
                name="template"
                value={formData.template}
                onChange={handleChange}
              >
                <option value="Visitor">VISITOR</option>
                <option value="Vendor">VENDOR</option>
                <option value="Consultant">CONSULTANT</option>
                <option value="Vip">VIP</option>
              </select>
            </div>
            <div className="flex flex-col w-[40%]">
              <label>Pass No. <span className="text-[var(--color)]">*</span></label>
              <input
                type="text"
                className="bg-[#f8f8f8] border"
                value={formData.passno}
                disabled
              />
            </div>
          </div>

          {/* Visitor Details */}
          <div className="border p-2 bg-white">
            <div>
              <div className="flex flex-row items-center gap-2 border-[var(--color)] border-b">
                              <MdOutlineSpeakerNotes />
                              <label>Visitor Details</label>
                            </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {["firstname", "lastname", "company", "mobile", "emailid", "addressline1", "addressline2", "city", "accompanyingvisitors", "pin"].map((field, index) => (
                  <div className="flex flex-col" key={field}>
                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input
                      type="text"
                      className="border"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      ref={el => inputRefs.current[index] = el}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
               {/* Pass Details */}
                        <div className="border border p-2 bg-white">
                          <div>
                            <div className="flex flex-row items-center gap-2 border-[var(--color)] border-b">
                              <MdOutlineSpeakerNotes />
                              <label>Pass Details</label>
                            </div>
          {/* Camera Section */}
          <div className="bg-white flex flex-col items-center">
            {isCapturing && (
              <video ref={videoRef} autoPlay className="w-full max-w-md" />
            )}
            <canvas ref={canvasRef} className="hidden"></canvas>

            {!formData.image ? (
              <div className="w-24 h-24 mt-2 flex items-center justify-center bg-gray-200 rounded-full">
                <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.75 0 5-2.25 5-5s-2.25-5-5-5-5 2.25-5 5 2.25 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
                </svg>
              </div>
            ) : (
              <img src={formData.image} alt="Captured" className="w-24 h-24 mt-2" />
            )}

            <div className="mt-2 flex space-x-4">
              {!isCapturing ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Open Camera
                </button>
              ) : (
                <button
                  type="button"
                  onClick={captureImage}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Capture
                </button>
              )}
            </div>
          </div>

          {/* Remaining Fields */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
  {["ToMeet", "department", "purpose", "area", "valid", "remarks", "vehicleNo", "spl"].map((field, index) => (
    <div className="flex flex-col relative" key={field}>
      <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
      {field === "ToMeet" ? (
        <>
          {/* Input for "ToMeet" with dynamic suggestions */}
          <input
            type="text"
            className="border"
            name={field}
            value={formData.ToMeet} // Bind to query state for dynamic search
            onChange={handleChange} // Trigger handleChange to fetch data
            ref={el => inputRefs.current[index + 10] = el}
          />
           {formData.suggestions.length > 0 && (
  <ul className="absolute left-0 top-full mt-1 w-[600px] border bg-white shadow-md rounded-md z-10 p-2">
    {formData.suggestions.map((faculty, index) => (
      <li
        key={index}
        className="grid grid-cols-4 p-2 hover:bg-gray-200 cursor-pointer border-b"
        onClick={() => handleSelect(faculty.name)}
      >
        <span>{faculty.name}</span>
        <span>{faculty.id}</span>
        <span>{faculty.address}</span>
        <span>{faculty.email}</span>
        <span>{faculty.phone}</span>
      </li>
    ))}
  </ul>
)}

        </>
      ) : (
        // For other fields, use the standard text input
        <input
          type={field === "valid" ? "datetime-local" : "text"}
          className="border"
          name={field}
          value={formData[field]}
          onChange={handleChange}
          ref={el => inputRefs.current[index + 10] = el}
        />
      )}
    </div>
  ))}
</div>

          </div>
          </div>

          {/* ID Scanner */}
          <div className="border p-2 bg-white">
            <div>
              <div className="flex flex-row items-center gap-2 border-[var(--color)] border-b">
                              <MdOutlineSpeakerNotes />
                              <label>ID Scanner</label>
                            </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
                <div className="flex flex-col">
                  <label>ID type</label>
                  <select
                    className="border"
                    name="idType"
                    value={formData.idType}
                    onChange={handleChange}
                  >
                    <option value="Aadhar Card">Aadhar Card</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Pan Card">Pan Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Voter Id">Voter ID</option>
                    <option value="others">Others</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label>ID No</label>
                  <input
                    type="text"
                    className="border"
                    name="idNo"
                    value={formData.idNo}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 ml-[750px] m-5">
            <button
              type="submit"
              className="bg-[var(--color)] text-white p-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Updating..." : "Register & Check In"}
            </button>
            <button type="button" className="bg-[var(--color)] text-white p-2 rounded-md">
              Back
            </button>
            <button type="button" className="bg-[var(--color)] text-white p-2 rounded-md">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
