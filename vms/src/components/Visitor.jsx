import { useState, useEffect } from "react";
import axios from "axios";

export default function Visitors() {
  const [visitors, setVisitors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchVisitors(page);
  }, [page]);

  const fetchVisitors = async (page) => {
    try {
      const res = await axios.get(
        `https://visitor-hub-backend.onrender.com/visitors?page=${page}&limit=5`
      );
      setVisitors(res.data.visitors);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching visitors", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Visitors List</h2>
      
      {/* Wrapper for the table to make it scrollable horizontally on smaller screens */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              {[
                "Pass No",
                "Name",
                "Image",
                "Company",
                "Mobile",
                "Email",
                "Address",
                "City",
                "Accompanying Visitor",
                "Pin",
                "To Meet",
                "Department",
                "Purpose",
                "Area",
                "Valid",
                "Remarks",
                "Vehicle No",
                "Special Instruction",
                "ID Type",
                "ID No",
                "Status",
              ].map((header) => (
                <th key={header} className="border p-2">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visitors.map((visitor) => (
              <tr key={visitor._id} className="hover:bg-gray-100">
                <td className="border p-2">{visitor.passno}</td>
                <td className="border p-2">{`${visitor.firstname} ${visitor.lastname}`}</td>
                <td className="border p-2">
                  <img
                    src={visitor.image}
                    alt="Visitor"
                    className="w-12 h-12 object-cover"
                  />
                </td>
                <td className="border p-2">{visitor.company}</td>
                <td className="border p-2">{visitor.mobile}</td>
                <td className="border p-2">{visitor.emailid}</td>
                <td className="border p-2">{visitor.addressline1}</td>
                <td className="border p-2">{visitor.city}</td>
                <td className="border p-2">{visitor.accompanyingvisitors}</td>
                <td className="border p-2">{visitor.pin}</td>
                <td className="border p-2">{visitor.ToMeet}</td>
                <td className="border p-2">{visitor.department}</td>
                <td className="border p-2">{visitor.purpose}</td>
                <td className="border p-2">{visitor.area}</td>
                <td className="border p-2">{visitor.valid}</td>
                <td className="border p-2">{visitor.remarks}</td>
                <td className="border p-2">{visitor.vehicleNo}</td>
                <td className="border p-2">{visitor.spl}</td>
                <td className="border p-2">{visitor.idType}</td>
                <td className="border p-2">{visitor.idNo}</td>
                <td className="border p-2">{visitor.status ? "In" : "Out"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded mr-2"
        >
          Prev
        </button>
        <span className="px-4 py-2">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 rounded ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}
