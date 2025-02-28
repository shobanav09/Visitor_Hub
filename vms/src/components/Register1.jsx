import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdOutlineSpeakerNotes } from "react-icons/md";

function Register1() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [template, setTemplate] = useState("Visitor");
  const [passno, setPassno] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [company, setCompany] = useState("");
  const [mobile, setMobile] = useState("");
  const [emailid, setEmailid] = useState("");
  const [addressline1, setAddressline1] = useState("");
  const [addressline2, setAddressline2] = useState("");
  const [city, setCity] = useState("");
  const [accompanyingvisitors, setAccompanyingvisitors] = useState("");
  const [pin, setPin] = useState("");
  const [image, setImage] = useState(null);
  const [purpose, setPurpose] = useState("");
  const [area, setArea] = useState("");
  const [valid, setValid] = useState("");
  const [remarks, setRemarks] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [idType, setIdType] = useState("Aadhar Card");
  const [idNo, setIdNo] = useState("");
  const [ToMeet, setToMeet] = useState("");
  const [department, setDepartment] = useState("CTS");
  const [spl, setSpl] = useState("");
  const [errors, setErrors] = useState({}); // For validation errors

  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Fetch suggestions for "To Meet"
  const fetchFaculty = async (searchTerm) => {
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/faculty/search?name=${searchTerm}`
      );
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

  const startCamera = async () => {
    setIsCapturing(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/latest-passno")
      .then((res) => setPassno(res.data.passno))
      .catch((err) => console.error("Error fetching pass number:", err));
  }, []);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setImage(canvas.toDataURL("image/png"));
    video.srcObject.getTracks().forEach((track) => track.stop());
    setIsCapturing(false);
  };

  // Validate all required fields
  const validateForm = () => {
    const newErrors = {};

    if (!firstname.trim()) newErrors.firstname = "First name is required";
    if (!lastname.trim()) newErrors.lastname = "Last name is required";
    if (!company.trim()) newErrors.company = "Company is required";
    if (!mobile.trim()) newErrors.mobile = "Mobile is required";
    else if (!/^\d{10}$/.test(mobile))
      newErrors.mobile = "Mobile must be 10 digits";
    if (!emailid.trim()) newErrors.emailid = "Email is required";
    else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailid)
    )
      newErrors.emailid = "Invalid email address";
    if (!addressline1.trim())
      newErrors.addressline1 = "Address Line 1 is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!accompanyingvisitors.trim())
      newErrors.accompanyingvisitors = "Accompanying visitors count is required";
    else if (isNaN(accompanyingvisitors))
      newErrors.accompanyingvisitors = "Must be a number";
    if (!pin.trim()) newErrors.pin = "PIN is required";
    else if (!/^\d{6}$/.test(pin))
      newErrors.pin = "PIN must be 6 digits";
    if (!purpose.trim()) newErrors.purpose = "Purpose is required";
    if (!area.trim()) newErrors.area = "Secure Area is required";
    if (!valid.trim()) newErrors.valid = "Valid Until is required";
    if (!remarks.trim()) newErrors.remarks = "Remarks is required";
    if (!vehicleNo.trim()) newErrors.vehicleNo = "Vehicle No. is required";
    if (!idNo.trim()) newErrors.idNo = "ID Number is required";
    if (!query.trim()) newErrors.ToMeet = "To Meet is required";

    setErrors(newErrors);
    // If any errors exist, return false
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!validateForm()) {
      alert("Please correct the errors in the form.");
      return;
    }
    if (!image) {
      alert("No image captured");
      return;
    }

    const formData = {
      template,
      passno,
      firstname,
      lastname,
      company,
      mobile,
      emailid,
      addressline1,
      addressline2,
      city,
      accompanyingvisitors,
      pin,
      purpose,
      area,
      valid,
      remarks,
      vehicleNo,
      image,
      idType,
      idNo,
      ToMeet: query, // using the query which contains the selected faculty name
      department,
      spl,
    };

    try {
      await axios.post("http://localhost:3000/visitor/register", formData);
      alert("Registration successful");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  const inputRefs = useRef([]);

  // Function to handle keypress navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === "ArrowRight") {
      // Move to next field if exists
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    } else if (e.key === "ArrowLeft") {
      // Move to previous field if exists
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  return (
    <div className="ml-[200px] mr-[200px]">
      <form method="post" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 ">
          <div className="flex flex-row gap-5 p-2 border border mt-2 bg-white">
            <div className="flex flex-col w-[40%] ">
              <label>
                View Template <span className="text-[var(--color)]">*</span>
              </label>
              <select
                className="border border"
                onChange={(e) => setTemplate(e.target.value)}
              >
                <option value="Visitor">VISITOR</option>
                <option value="Vendor">VENDOR</option>
                <option value="Consultant">CONSULTANT</option>
                <option value="Vip">VIP</option>
              </select>
            </div>
            <div className="flex flex-col w-[40%]">
              <label>
                Pass No. <span className="text-[var(--color)]">*</span>
              </label>
              <input
                type="text"
                className="bg-[#f8f8f8] border border"
                value={passno}
                disabled
              />
            </div>
          </div>

          {/* Visitor Details */}
          <div className="border border p-2 bg-white">
            <div>
              <div className="flex flex-row items-center gap-2 border-[var(--color)] border-b">
                <MdOutlineSpeakerNotes />
                <label>Visitor Details</label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                <div className="flex flex-col">
                  <label>
                    First Name
                    <span className="text-[var(--color)]">*</span>
                  </label>
                  <input
                    type="text"
                    className="border border"
                    onChange={(e) => setFirstname(e.target.value)}
                    ref={(el) => (inputRefs.current[0] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 0)}
                  />
                  {errors.firstname && (
                    <span className="text-red-500 text-xs">{errors.firstname}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label>
                    Last Name
                    <span className="text-[var(--color)]">*</span>
                  </label>
                  <input
                    type="text"
                    className="border border"
                    onChange={(e) => setLastname(e.target.value)}
                    ref={(el) => (inputRefs.current[1] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 1)}
                  />
                  {errors.lastname && (
                    <span className="text-red-500 text-xs">{errors.lastname}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label>
                    Company
                    <span className="text-[var(--color)]">*</span>
                  </label>
                  <input
                    type="text"
                    className="border border"
                    onChange={(e) => setCompany(e.target.value)}
                    ref={(el) => (inputRefs.current[2] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 2)}
                  />
                  {errors.company && (
                    <span className="text-red-500 text-xs">{errors.company}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label>Mobile</label>
                  <input
                    type="text"
                    className="border border"
                    onChange={(e) => setMobile(e.target.value)}
                    ref={(el) => (inputRefs.current[3] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 3)}
                  />
                  {errors.mobile && (
                    <span className="text-red-500 text-xs">{errors.mobile}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label>Email ID</label>
                  <input
                    type="text"
                    className="border border"
                    onChange={(e) => setEmailid(e.target.value)}
                    ref={(el) => (inputRefs.current[4] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 4)}
                  />
                  {errors.emailid && (
                    <span className="text-red-500 text-xs">{errors.emailid}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label>Address Line1</label>
                  <input
                    type="text"
                    className="border border"
                    onChange={(e) => setAddressline1(e.target.value)}
                    ref={(el) => (inputRefs.current[5] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 5)}
                  />
                  {errors.addressline1 && (
                    <span className="text-red-500 text-xs">
                      {errors.addressline1}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label>Address Line2</label>
                  <input
                    type="text"
                    className="border border"
                    onChange={(e) => setAddressline2(e.target.value)}
                    ref={(el) => (inputRefs.current[6] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 6)}
                  />
                </div>
                <div className="flex flex-col">
                  <label>City</label>
                  <input
                    type="text"
                    className="border border"
                    onChange={(e) => setCity(e.target.value)}
                    ref={(el) => (inputRefs.current[7] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 7)}
                  />
                  {errors.city && (
                    <span className="text-red-500 text-xs">{errors.city}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label>Accompanying Visitors</label>
                  <input
                    type="text"
                    className="border border"
                    onChange={(e) => setAccompanyingvisitors(e.target.value)}
                    ref={(el) => (inputRefs.current[8] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 8)}
                  />
                  {errors.accompanyingvisitors && (
                    <span className="text-red-500 text-xs">
                      {errors.accompanyingvisitors}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label>PIN</label>
                  <input
                    type="text"
                    className="border border"
                    onChange={(e) => setPin(e.target.value)}
                    ref={(el) => (inputRefs.current[9] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 9)}
                  />
                  {errors.pin && (
                    <span className="text-red-500 text-xs">{errors.pin}</span>
                  )}
                </div>
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

                {!image ? (
                  <div className="w-24 h-24 mt-2 flex items-center justify-center bg-gray-200 rounded-full">
                    <svg
                      className="w-12 h-12 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.75 0 5-2.25 5-5s-2.25-5-5-5-5 2.25-5 5 2.25 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
                    </svg>
                  </div>
                ) : (
                  <img src={image} alt="Captured" className="w-24 h-24 mt-2" />
                )}

                <div className="mt-2 flex space-x-4">
                  {!isCapturing ? (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      ref={(el) => (inputRefs.current[10] = el)}
                      onKeyDown={(e) => handleKeyDown(e, 10)}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
                <div className="flex flex-col relative">
                  <label htmlFor="toMeet">To Meet</label>
                  <input
                    type="text"
                    id="toMeet"
                    className="border"
                    value={query}
                    onChange={handleChange}
                    ref={(el) => (inputRefs.current[11] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 11)}
                  />
                  {errors.ToMeet && (
                    <span className="text-red-500 text-xs">{errors.ToMeet}</span>
                  )}

                  {/* Suggestion List */}
                  {suggestions.length > 0 && (
                    <ul className="absolute left-0 top-full mt-1 w-[600px] border bg-white shadow-md rounded-md z-10 p-2">
                      {suggestions.map((faculty, index) => (
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
                </div>
                <div className="flex flex-col">
                  <label>Department</label>
                  <select
                    className="border border"
                    onChange={(e) => setDepartment(e.target.value)}
                    ref={(el) => (inputRefs.current[12] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 12)}
                  >
                    <option value="CTS">CTS</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label>Purpose</label>
                  <input
                    type="text"
                    className="border border"
                    onChange={(e) => setPurpose(e.target.value)}
                    ref={(el) => (inputRefs.current[13] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 13)}
                  />
                  {errors.purpose && (
                    <span className="text-red-500 text-xs">{errors.purpose}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label>Secure Area</label>
                  <input
                    type="text"
                    className="border border"
                    onChange={(e) => setArea(e.target.value)}
                    ref={(el) => (inputRefs.current[14] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 14)}
                  />
                  {errors.area && (
                    <span className="text-red-500 text-xs">{errors.area}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label>Valid Until</label>
                  <input
                    type="datetime-local"
                    className="border border"
                    onChange={(e) => setValid(e.target.value)}
                    ref={(el) => (inputRefs.current[15] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 15)}
                  />
                  {errors.valid && (
                    <span className="text-red-500 text-xs">{errors.valid}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label>Remarks</label>
                  <input
                    type="text"
                    className="border border"
                    onChange={(e) => setRemarks(e.target.value)}
                    ref={(el) => (inputRefs.current[16] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 16)}
                  />
                  {errors.remarks && (
                    <span className="text-red-500 text-xs">{errors.remarks}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label>Vehicle No.</label>
                  <input
                    type="text"
                    className="border border"
                    onChange={(e) => setVehicleNo(e.target.value)}
                    ref={(el) => (inputRefs.current[17] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 17)}
                  />
                  {errors.vehicleNo && (
                    <span className="text-red-500 text-xs">{errors.vehicleNo}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label>Special Instruction</label>
                  <input
                    type="text"
                    className="border border"
                    onChange={(e) => setSpl(e.target.value)}
                    ref={(el) => (inputRefs.current[18] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 18)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ID Scanner */}
          <div className="border border p-2 bg-white">
            <div>
              <div className="flex flex-row items-center gap-2 border-[var(--color)] border-b">
                <MdOutlineSpeakerNotes />
                <label>ID Scanner</label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
                <div className="flex flex-col">
                  <label>ID type</label>
                  <select
                    className="border border"
                    onChange={(e) => setIdType(e.target.value)}
                    ref={(el) => (inputRefs.current[19] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 19)}
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
                    className="border border"
                    onChange={(e) => setIdNo(e.target.value)}
                    ref={(el) => (inputRefs.current[20] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 20)}
                  />
                  {errors.idNo && (
                    <span className="text-red-500 text-xs">{errors.idNo}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 ml-[750px] m-5">
            <button
              type="submit"
              className="bg-[var(--color)] text-white p-2 rounded-md"
            >
              Register & Check In
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

export default Register1;