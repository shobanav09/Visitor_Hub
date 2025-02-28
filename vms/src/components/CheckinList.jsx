import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserEdit, FaPrint, FaUsers } from "react-icons/fa";
import { FaRegAddressCard } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { IoMdExit } from "react-icons/io";

import logo from '../img/logo.png';

function CheckinList() {
  const [visitors, setVisitors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://visitor-hub-backend.onrender.com/visitors")
      .then((res) => {
        if (Array.isArray(res.data.visitors)) {
          // Filter visitors to show only those with status true
          const activeVisitors = res.data.visitors.filter(visitor => visitor.status === true);
          setVisitors(activeVisitors);
        } else {
          console.error("Unexpected data format:", res.data);
        }
      })
      .catch((err) => console.error("Error fetching visitors:", err));
  }, []);

  const getValidUntil = (createdAt) => {
    const createdDate = new Date(createdAt);
    createdDate.setHours(createdDate.getHours() + 1);
  
    // Options to format the time in 24-hour format
    const options = {
      hour12: false, // Ensures a 24-hour format
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
  
    // Use 'en-GB' locale for a 24-hour format
    return createdDate.toLocaleString('en-GB', options); 
  };
  
  const handlePrint = (visitor) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Visitor Pass</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f0f0f0;
          }
          .visitor-pass {
              width: 350px;
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              display: flex;
              flex-direction: column;
          }
          .header {
              display: flex;
              margin-bottom: 15px;
          }
          .header .title {
              font-weight: bold;
              font-size: 18px;
              flex: 1;
          }
          .header img {
              height: 20px;
              margin-left: 10px;
          }
          .details {
              display: flex;
              gap: 15px;
          }
          .left {
              display: flex;
              flex-direction: column;
              align-items: center;
          }
              .date{
              font-size: 10px;}
          .left img {
              width: 80px;
              height: 100px;
              border-radius: 10%;
              object-fit: cover;
              margin-bottom: 10px;
          }
          .pass-number {
              font-weight: bold;
              font-size: 16px;
              color: #333;
          }
          .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    font-size: 14px;
}

.info p {
    display: flex;
    text-align : left;  /* Distribute content evenly */
    margin: 5px 0;
}

.info p strong {
    width: 120px;  /* Fixed width for labels to align them */
    text-align: left;
    padding-right: 5px;
}

      </style>
  </head>
  <body>
      <div class="visitor-pass">
          <div class="header">
              <div class="title">VISITOR</div>
              <img src="${logo}" alt="Logo">
          </div>
          <div class="details">
              <div class="left">
                  <img src="${visitor.image || 'https://via.placeholder.com/100'}" alt="Visitor Photo">
                  <div class="pass-number"> ${visitor.passno}</div>
                  <div class="date">${new Date(visitor.createdAt).toLocaleString('en-GB', {
                    hour12: false, // Ensures a 24-hour format
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}</div>
              </div>
              <div class="info">
                  <p><strong>Name:</strong> ${visitor.firstname} ${visitor.lastname}</p>
                  <p><strong>Company:</strong> ${visitor.company}</p>
                  <p><strong>To Meet:</strong> ${visitor.toMeet}</p>
                  <p><strong>Department:</strong> ${visitor.department}</p>
                  <p><strong>Purpose:</strong> ${visitor.purpose}</p>
                  <p><strong>To Date & Time:</strong> ${getValidUntil(visitor.createdAt)}</p>
              </div>
          </div>
      </div>
  
      <script>
          window.onload = function() {
              window.print();
              setTimeout(() => { window.close(); }, 100);
          };
      </script>
  </body>
  </html>
  `);
    printWindow.document.close();
  };
  

  // When edit icon is clicked, navigate to Register1 with the visitor’s passno as a parameter.
  const handleEdit = (visitor) => {
    navigate(`/visitor/${visitor.passno}`);
  };

  const handleExit = (visitor) => {
    // Ask for confirmation before checkout
    const isConfirmed = window.confirm(`Are you sure you want to checkout visitor ${visitor.firstname} ${visitor.lastname}?`);

    if (isConfirmed) {
      // Update the visitor's status to 'false' (checked out)
      axios
        .patch(`https://visitor-hub-backend.onrender.com/visitors/${visitor.passno}`, { status: false })
        .then((response) => {
          // Successfully updated the status
          alert("Visitor successfully checked out.");
          // Update the visitors list to reflect the change
          setVisitors(visitors.map(v => (v.passno === visitor.passno ? { ...v, status: false } : v)));
        })
        .catch((err) => {
          console.error("Error updating visitor status:", err);
          alert("There was an error checking out the visitor.");
        });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Checked-in Visitors</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visitors.map((visitor) => (
          <div key={visitor.passno} className="bg-white shadow-lg rounded-lg p-4 border">
            <div className="flex flex-row justify-between border-b-2">
              <div className="flex flex-row-reverse gap-2 items-center">
                <div className="text-gray-400 text-sm">{visitor.passno}</div>
                <FaRegAddressCard />
              </div>
              <div className="flex space-x-2 text-gray-500">
                <FaUsers className="cursor-pointer hover:text-blue-600" />
                <FaPrint
                  className="cursor-pointer hover:text-green-600"
                  onClick={() => handlePrint(visitor)}
                />
                <IoMdExit
                  className="cursor-pointer hover:text-red-600"
                  onClick={() => handleExit(visitor)} // Handle checkout
                />
                <FaUserEdit
                  className="cursor-pointer hover:text-yellow-600"
                  onClick={() => handleEdit(visitor)}
                />
              </div>
            </div>
            <div className="flex flex-row gap-3 border-b-2 p-2">
              <img
                src={visitor.image || "https://via.placeholder.com/100"}
                alt="Visitor"
                className="w-28 h-28 rounded-md object-cover border"
              />
              <div className="flex-grow">
                <h3 className="text-lg">
                  {visitor.firstname} {visitor.lastname}
                </h3>
                <p className="text-gray-500">{visitor.company}</p>
                <p className="text-gray-500">{visitor.city}</p>
                <p className="text-gray-500">{visitor.purpose}</p>
                <p className="text-gray-500">
                  Valid Until: {getValidUntil(visitor.createdAt)}
                </p>
              </div>
            </div>
            <span className="text-xs text-gray-400">
  {new Date(visitor.createdAt).toLocaleString('en-GB', {
    hour12: false, // Ensures a 24-hour format
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })}
</span>

          </div>
        ))}
      </div>
    </div>
  );
}

export default CheckinList;
