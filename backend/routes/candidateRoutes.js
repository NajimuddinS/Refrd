const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.js');
const {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  getCandidateResume,
  getCandidateStatusByEmail
} = require('../controllers/candidateController');

router.post('/', upload.single('resume'), createCandidate);
router.get('/', getAllCandidates);
router.get('/:id', getCandidateById);
router.get('/:id/resume', getCandidateResume);
router.put('/:id',upload.single('resume'), updateCandidate);
router.delete('/:id', deleteCandidate);
router.get('/status/check', getCandidateStatusByEmail);


module.exports = router;
