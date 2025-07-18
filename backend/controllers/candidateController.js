const Candidate = require('../models/Candidate');
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("../utils/s3");
const https = require('https');
const { URL } = require('url');
// Create
const createCandidate = async (req, res) => {
  try {
    let resumeUrl = null;

    // If file uploaded, generate a signed URL
    if (req.file) {
      const key = req.file.key;

      // Generate signed URL valid for 1 hour
      resumeUrl = await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
        }),
        { expiresIn: 60 * 60 }
      );
    }

    const candidate = new Candidate({
      ...req.body,
      resumeUrl,
    });

    const saved = await candidate.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Candidate Creation Error:", err);
    res.status(400).json({ error: err.message });
  }
};

// Read All
const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().populate('referredBy', 'name email');
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCandidateResume = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate || !candidate.resumeUrl) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Parse the S3 URL
    const s3Url = new URL(candidate.resumeUrl);
    
    // Set headers for the client
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${candidate.name}_resume.pdf"`);

    // Proxy the request using native Node.js https
    https.get(s3Url, (s3Response) => {
      s3Response.pipe(res);
    }).on('error', (err) => {
      console.error('S3 request error:', err);
      res.status(500).json({ message: 'Error fetching resume' });
    });
    
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ message: error.message });
  }
};

// Read One
const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).populate('referredBy', 'name email');
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
const updateCandidate = async (req, res) => {
  try {
    let updateData = {
      ...req.body,
      updatedAt: Date.now(),
    };

    // If a new resume file is uploaded
    if (req.file) {
      const key = req.file.key;

      // Generate a new signed URL
      const resumeUrl = await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
        }),
        { expiresIn: 60 * 60 * 24 * 7 } // 1 week expiration
      );

      updateData.resumeUrl = resumeUrl;
    } else {
      // If no file uploaded, keep the existing resumeUrl if it exists
      const existingCandidate = await Candidate.findById(req.params.id);
      if (existingCandidate && existingCandidate.resumeUrl) {
        updateData.resumeUrl = existingCandidate.resumeUrl;
      }
    }

    const updated = await Candidate.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error("Candidate Update Error:", err);
    
    // More detailed error response
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        details: err.errors
      });
    }
    
    res.status(400).json({ 
      error: err.message,
    //   stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// Public: Get candidate status by email
const getCandidateStatusByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const candidate = await Candidate.findOne({ email });

    if (!candidate) {
      return res.status(404).json({ status: 'notFound' });
    }

    // You can customize this based on status field or other business logic
    return res.json({
      status: candidate.status || 'pending', // default fallback
      name: candidate.name,
      jobTitle: candidate.jobTitle
    });
  } catch (err) {
    console.error("Error checking referral status:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Delete
const deleteCandidate = async (req, res) => {
  try {
    const deleted = await Candidate.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Candidate not found' });
    res.json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  getCandidateResume,
  getCandidateStatusByEmail
};
