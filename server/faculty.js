const mongoose = require("mongoose");

const FacultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  address: { type: String },
  email: {type:String},
  phone: { type: String },
}, { timestamps: true });

const Faculty = mongoose.model("Faculty", FacultySchema);

// ✅ Predefined Faculty Data
async function insertPredefinedFaculty() {
  const predefinedFaculties = [
    { name: "Dr. A. Kumar", id: "F001", address: "Chennai, TN", email: "Kumar@gmail.com" , phone: "9876543210" },
    { name: "Prof. B. Sharma", id: "F002", address: "Bangalore, KA", email: "sharma@gmail.com" ,phone: "8765432109" },
    { name: "Dr. C. Verma", id: "F003", address: "Hyderabad, TS", email: "verma@gmail.com" , phone: "7654321098" },
    { name: "Dr. D. Mehta", id: "F004", address: "Mumbai, MH", email:"mehta@gmail.com",phone: "6543210987" },
    { name: "Prof. E. Nair", id: "F005", address: "Kochi, KL", email:"nair@gmail.com",phone: "5432109876" },
  ];

  try {
    const count = await Faculty.countDocuments();
    if (count === 0) {
      await Faculty.insertMany(predefinedFaculties);
      console.log("✅ Predefined faculty data inserted");
    }
  } catch (error) {
    console.error("❌ Error inserting predefined data:", error);
  }
}

insertPredefinedFaculty();

module.exports = Faculty;
