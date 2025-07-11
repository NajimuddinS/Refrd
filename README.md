# 💾 Refrd – Candidate Referral Management System

[Live Demo 🔗](https://refrd.vercel.app) • [GitHub Repo 💻](https://github.com/NajimuddinS/Refrd.git)

---

## 🔧 Overview

**Refrd** is a full-stack MERN app designed to simulate a candidate referral workflow. It supports:

* Submitting referrals
* Viewing and filtering candidates
* Updating referral statuses

Includes AWS S3 for resume upload and Tailwind CSS for responsive design.

---

## ✨ Features

### Frontend (React + Tailwind CSS)

* **Dashboard**: View and filter referred candidates
* **Referral Form**: Submit referrals with resume upload (.pdf only)
* **Status Update**: Change candidate status (Pending → Reviewed → Hired)

### Backend (Node.js + Express)

* **POST /candidates**: Add a new candidate
* **GET /candidates**: Retrieve all candidates
* **PUT /candidates/\:id/status**: Update candidate status
* **DELETE /candidates/\:id** (optional): Remove candidate
* Input validation for email, phone number, and file type

### Cloud

* **AWS S3**: Resume upload and storage

---

## 📄 Tech Stack

* **Frontend**: React, Tailwind CSS
* **Backend**: Node.js, Express
* **Database**: MongoDB
* **Storage**: AWS S3 Bucket
* **Hosting**: Vercel (frontend)

---

## 🚀 Run Locally

### 1. Clone Repository

```bash
git clone https://github.com/NajimuddinS/Refrd.git
cd Refrd
```

### 2. Environment Setup

Create `.env` files:

**/server/.env**

```
PORT=5000
MONGO_URI=your_mongodb_connection
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET_NAME=your_bucket
AWS_REGION=your_region
```

**/client/.env**

```
REACT_APP_API_BASE_URL=http://localhost:5000
```

### 3. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 4. Run Application

```bash
# Start backend
cd server
npm run dev

# Start frontend (in separate terminal)
cd client
npm start
```

---

## 📊 Optional Enhancements

* JWT Authentication
* Resume cloud storage via AWS S3
* Metrics: total candidates, status distribution

---

## 📓 Deliverables

* GitHub Repo with full source
* Live demo (see top)
* API documentation or Postman collection (optional)
* This README

---

## 👀 Limitations

* No user roles or admin auth yet
* PDF-only resume support
* Basic input validation

---

Made with ❤️ using MERN stack & AWS
