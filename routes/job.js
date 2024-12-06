const express = require("express");
const router = express.Router();
const Job = require("../schemas/job.schema");
const User = require("../schemas/user.schema");
const { isLoggedIn } = require("../middleware/auth");

// Create Job
router.post("/", isLoggedIn, async (req, res) => {
    try {
        const { companyName, logoURL, position, salary, jobType, remote, location, description,about, skillsRequired } = req.body;
        if (skillsRequired && !Array.isArray(skillsRequired)) {
          return res.status(400).json({ message: "skillsRequired must be an array of strings" });
      }

        const newJob = new Job({
            companyName,
            logoURL,
            position,
            salary,
            jobType,
            remote,
            location,
            description,
            about,
            skillsRequired: skillsRequired || [],
            userId: req.user.id,
        });
        await newJob.save();
        res.status(201).json({ message: "Job created successfully", id: newJob._id });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Update Job
router.put("/:id", isLoggedIn, async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, userId: req.user.id });
        if (!job) return res.status(404).json({ message: "Job not found" });

        Object.assign(job, req.body);
        await job.save();
        res.status(200).json({ message: "Job updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Delete Job
router.delete("/:id", isLoggedIn, async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, userId: req.user.id });
        if (!job) return res.status(404).json({ message: "Job not found" });

        await Job.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
// Get Job Details by ID
router.get("/details/:id", async (req, res) => {
  try {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: "Job not found" });
      res.status(200).json(job);
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get All Jobs with Filters
// Get All Jobs with Filters
router.get("/all-jobs", async (req, res) => {
  try {
      const { search, jobType, remote, minSalary, maxSalary, skills } = req.query;
      const filters = {};

      // Filter by job position (search query)
      if (search) filters.position = { $regex: search, $options: "i" };

      // Filter by job type
      if (jobType) filters.jobType = jobType;

      // Filter by remote status
      if (remote !== undefined) filters.remote = remote === "true";

      // Filter by salary range
      if (minSalary) filters.salary = { $gte: Number(minSalary) };
      if (maxSalary) filters.salary = { ...filters.salary, $lte: Number(maxSalary) };

      // Filter by skills
      if (skills) {
        const skillsArray = skills.split(',');  // Convert comma-separated string into array
        filters.skillsRequired = { $all: skillsArray };  // Match all skills in the job's skillsRequired array
      }

      const jobs = await Job.find(filters).sort({ createdAt: -1 });
      res.status(200).json(jobs);
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/skills", async (req, res) => {
  console.log("Request received for /skills");
  try {
    const jobs = await Job.find();
    console.log("Jobs fetched:", jobs.length);
    const skillsSet = new Set();

    jobs.forEach(job => {
      if (job.skillsRequired && Array.isArray(job.skillsRequired)) {
        job.skillsRequired.forEach(skill => skillsSet.add(skill));
      }
    });

    const uniqueSkills = Array.from(skillsSet);
    res.status(200).json({ skills: uniqueSkills });
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




module.exports = router;