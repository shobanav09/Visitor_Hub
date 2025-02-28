require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const DB_NAME = 'minoto';
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json({ limit: "10mb" }));
const router = express.Router();
app.use(router);

const Faculty = require("./faculty");
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Visitor Schema
const VisitorSchema = new mongoose.Schema({
  template: { type: String, trim: true },
  passno: { type: String, required: true, unique: true, trim: true },
  firstname: { type: String, required: true, trim: true, minlength: 2 },
  lastname: { type: String, required: true, trim: true },
  company: { type: String, trim: true },
  mobile: {
    type: String,
    required: true,
    validate: {
      validator: v => /^\d{10}$/.test(v),
      message: "Mobile number must be 10 digits",
    },
  },
  emailid: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: v => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
      message: "Invalid email format",
    },
  },
  addressline1: { type: String, trim: true },
  addressline2: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  accompanyingvisitors: { type: String, trim: true },
  pin: {
    type: String,
    validate: {
      validator: v => /^\d{6}$/.test(v),
      message: "PIN must be exactly 6 digits",
    },
  },
  ToMeet: { type: String, required: true },
  department: { type: String, trim: true },
  purpose: { type: String, trim: true },
  area: { type: String, trim: true },
  valid: { type: String, trim: true },
  remarks: { type: String, trim: true },
  vehicleNo: {
    type: String
    // validate: {
    //   validator: v => /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(v),
    //   message: "Invalid vehicle number format",
    // },
  },
  spl: { type: String, trim: true },
  image: { type: String, trim: true },
  idType: {
    type: String,
    enum: ["Aadhaar", "PAN", "Passport", "Voter ID", "Driving License"],
    required: true,
  },
  idNo: { type: String, required: true, trim: true },
  status : {type: Boolean, default:true,required:false}
}, { timestamps: true });

// Auto-generate pass number before saving
VisitorSchema.pre("save", async function (next) {
  if (!this.passno) {
    const lastVisitor = await Visitor.findOne().sort({ createdAt: -1 });
    const lastPassNo = lastVisitor?.passno ? parseInt(lastVisitor.passno, 10) : 0;
    this.passno = String(lastPassNo + 1).padStart(5, "0");
  }
  next();
});

const Visitor = mongoose.model("Visitor", VisitorSchema);

// Register New Visitor
app.post("/visitor/register", async (req, res) => {
  try {
    const newVisitor = new Visitor(req.body);
    await newVisitor.save();
    res.status(201).json({ success: true, message: "Visitor registered successfully!" });
  } catch (error) {
    console.error("Error registering visitor:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch('/visitors/:passno', async (req, res) => {
  try {
    const { passno } = req.params;
    const { status } = req.body; // Expecting { status: false }
    
    const updatedVisitor = await Visitor.findOneAndUpdate(
      { passno },
      { status },
      { new: true } // Return the updated document
    );
    
    if (!updatedVisitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }
    
    res.json(updatedVisitor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
// Get Visitors (Pagination Supported)
app.get("/visitors", async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const totalVisitors = await Visitor.countDocuments();
    const visitors = await Visitor.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      visitors,
      totalPages: Math.ceil(totalVisitors / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch visitors" });
  }
});

// Get Next Available Pass Number
router.get("/latest-passno", async (req, res) => {
  try {
    const lastVisitor = await Visitor.findOne().sort({ createdAt: -1 });
    const nextPassNo = lastVisitor ? String(parseInt(lastVisitor.passno, 10) + 1).padStart(5, "0") : "00001";
    res.json({ passno: nextPassNo });
  } catch (error) {
    res.status(500).json({ error: "Error fetching pass number" });
  }
});

// Delete Visitor
app.delete("/visitor/:id", async (req, res) => {
  try {
    const deletedVisitor = await Visitor.findByIdAndDelete(req.params.id);
    if (!deletedVisitor) return res.status(404).json({ error: "Visitor not found" });
    res.json({ success: true, message: "Visitor deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete visitor" });
  }
});


//Search toMeet

app.get("/faculty/search", async (req, res) => {
  try {
    const searchQuery = req.query.name || "";
    if (!searchQuery) return res.json([]);

    const results = await Faculty.find({
      name: { $regex: searchQuery, $options: "i" }, // Case-insensitive search
    }).limit(10);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get Visitor by passno
app.get("/visitor/:passno", async (req, res) => {
  try {
    const visitor = await Visitor.findOne({ passno: req.params.passno });
    if (!visitor) return res.status(404).json({ error: "Visitor not found" });
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch visitor" });
  }
});

app.put("/visitor/:passno", async (req, res) => {
  try {
    const updatedVisitor = await Visitor.findOneAndUpdate(
      { passno: req.params.passno },
      req.body,
      { new: true }
    );
    if (!updatedVisitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }
    res.json(updatedVisitor);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// Start Server
app.listen(port, () => console.log("Server running"));