// controllers/recordController.js
const { validationResult } = require("express-validator");
// const bcrypt = require("bcrypt");
const bcrypt = require("bcryptjs");

const Record = require("../Models/record");
const fs = require("fs");

const saltRounds = 10;

// Create
exports.createRecord = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const {
      firstname, lastname, email, password,
      age, gender, hobbies, country, about, dob, satisfaction
    } = req.body;

    // check email uniqueness
    const exists = await Record.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, saltRounds);

    const rec = new Record({
      firstname,
      lastname,
      email,
      passwordHash,
      age,
      gender,
      hobbies: Array.isArray(hobbies) ? hobbies : (hobbies ? JSON.parse(hobbies) : []),
      country,
      about,
      dob,
      satisfaction: satisfaction ?? 50
    });

    if (req.file) {
      rec.file = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      };
    }

    await rec.save();

    // Do not return passwordHash
    const obj = rec.toObject();
    delete obj.passwordHash;

    res.status(201).json(obj);
  } catch (err) {
    next(err);
  }
};

// List
exports.getRecords = async (req, res, next) => {
  try {
    const records = await Record.find().sort({ createdAt: -1 });
    // remove passwordHash
    const sanitized = records.map(r => {
      const o = r.toObject();
      delete o.passwordHash;
      return o;
    });
    res.json(sanitized);
  } catch (err) {
    next(err);
  }
};

// Get single
exports.getRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rec = await Record.findById(id);
    if (!rec) return res.status(404).json({ error: "Record not found" });

    const o = rec.toObject();
    delete o.passwordHash;
    res.json(o);
  } catch (err) {
    next(err);
  }
};

// Update
exports.updateRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const rec = await Record.findById(id);
    if (!rec) return res.status(404).json({ error: "Record not found" });

    const up = req.body;

    // if updating email, check uniqueness
    if (up.email && up.email !== rec.email) {
      const exists = await Record.findOne({ email: up.email });
      if (exists) return res.status(400).json({ error: "Email already in use" });
    }

    if (up.password) {
      rec.passwordHash = await bcrypt.hash(up.password, saltRounds);
    }

    // parse hobbies if sent as string from formData
    if (up.hobbies && typeof up.hobbies === "string") {
      try { up.hobbies = JSON.parse(up.hobbies); } catch (e) { up.hobbies = [up.hobbies]; }
    }

    // copy allowed fields
    const allowed = ["firstname","lastname","email","age","gender","hobbies","country","about","dob","satisfaction"];
    allowed.forEach(k => { if (up[k] !== undefined) rec[k] = up[k]; });

    if (req.file) {
      // remove old file if exists
      if (rec.file && rec.file.path && fs.existsSync(rec.file.path)) {
        fs.unlinkSync(rec.file.path);
      }
      rec.file = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      };
    }

    await rec.save();

    const o = rec.toObject(); delete o.passwordHash;
    res.json(o);
  } catch (err) {
    next(err);
  }
};

// Delete
exports.deleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rec = await Record.findById(id);
    if (!rec) return res.status(404).json({ error: "Record not found" });

    // delete file if exists
    if (rec.file && rec.file.path && fs.existsSync(rec.file.path)) {
      fs.unlinkSync(rec.file.path);
    }

    await rec.deleteOne();

    res.json({ message: "Record deleted" });
  } catch (err) {
    next(err);
  }
};
