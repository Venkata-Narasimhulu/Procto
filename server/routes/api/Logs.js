const express = require("express");
const router = express.Router();

const Logs = require("../../models/Logs");
const User = require("../../models/Users");

// POST /logs/update — Create or update a log with collegeId if needed
router.post("/update", async (req, res) => {
  try {
    const { exam_code, student_email } = req.body;

    let log = await Logs.findOne({ exam_code, student_email });

    if (!log) {
      const user = await User.findOne({ email: student_email });
      if (!user) {
        return res.status(404).json("User not found");
      }
      req.body.collegeId = user.collegeId;
    }

    await Logs.findOneAndUpdate(
      { exam_code, student_email },
      req.body,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json("Success");
  } catch (err) {
    console.error(err);
    return res.status(400).json("Error Occurred");
  }
});

// GET /logs/logByEmail — Get single log
router.get("/logByEmail", async (req, res) => {
  try {
    const { exam_code, student_email } = req.query;

    const log = await Logs.findOne({ exam_code, student_email });

    if (!log) {
      return res.status(400).json("Student taking exam for the first time");
    }

    return res.status(200).json(log);
  } catch (err) {
    console.error(err);
    return res.status(400).json("Error Occurred");
  }
});

// POST /logs/allData — Get all logs for a given exam_code
router.post("/allData", async (req, res) => {
  try {
    const logs = await Logs.find({ exam_code: req.body.exam_code });

    const logsWithCollegeId = await Promise.all(
      logs.map(async (log) => {
        if (!log.collegeId) {
          const user = await User.findOne({ email: log.student_email });
          if (user && user.collegeId) {
            log.collegeId = user.collegeId;
            // Save it to DB to persist it
            await log.save();
          } else {
            log.collegeId = "N/A";
          }
        }
        return log;
      })
    );

    return res.status(200).json(logsWithCollegeId);
  } catch (err) {
    console.error(err);
    return res.status(400).json("Error Occurred");
  }
});

module.exports = router;
