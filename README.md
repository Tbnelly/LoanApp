# Loan Application System

A simple Loan Application Web App built with **React, Firebase Authentication, Firestore, and .NET API**.  
The application allows users to create accounts, log in, apply for loans, and view their loan history.

---

## Project Overview

This project was developed as part of a **Frontend Assessment** to demonstrate the ability to build a full-stack web application using modern technologies.

Users can:

- Sign up for an account
- Sign in securely
- Apply for a loan
- View previously submitted loans

---

## Tech Stack

### Frontend
- ReactJS
- Axios
- React Router
- CSS / Bootstrap (if used)

### Backend
- .NET Web API
- CRUD API for loan applications

### Firebase
- Firebase Authentication (Email/Password)
- Firestore Database

### Hosting (Optional)
- Firebase Hosting

---

## Features

### Authentication

#### Sign Up
Users can create an account using:

- Full Name
- Email
- Password

Firebase Authentication is used to securely create and manage user accounts.

Validation is implemented to ensure all required fields are filled.

---

#### Sign In

Users can log in using:

- Email
- Password

Firebase Authentication handles user login and authentication errors are displayed appropriately.

---

### Loan Application

After logging in, users can submit a loan application.

Fields include:

- Loan Amount
- Loan Purpose (Dropdown)
- Loan Term (Months/Years)

Additional functionality:

- Input validation
- Loading state during submission
- Success/Error messages

Loan data is sent to the **.NET backend API** and stored in the database.

---

### Loan History

Users can view all loans associated with their account.

Features:

- Fetch loans from backend
- Loading state while retrieving data
- Message displayed if no loans exist

---

## Project Structure
LoanApp
│
├── frontend
│ ├── components
│ ├── pages
│ ├── services
│ └── App.js
│
├── backend
│ ├── Controllers
│ ├── Models
│ ├── Services
│ └── Program.cs
│
└── README.md


---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Tbnelly/LoanApp.git
2. Install Frontend Dependencies
cd frontend
npm install
3. Run the Frontend
npm start

The frontend should run on:

http://localhost:3000
4. Run Backend (.NET API)

Navigate to the backend folder:

cd backend

Run the API:

dotnet run
Firebase Configuration

Create a .env file in the frontend project and add your Firebase configuration.

Example:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=your_base_url

⚠️ Sensitive credentials should not be pushed to GitHub.

API Endpoints (Example)
Method	Endpoint	Description
POST	/api/loans	Submit loan application
GET	/api/loans	Fetch user loans
PUT	/api/loans/{id}	Edit loan
Validation

The application includes:

Required field validation

Email format validation

Password validation

Loan amount validation

Future Improvements

Loan approval workflow

Admin dashboard

File upload for documents

Better UI styling

Pagination for loan history

Author

Developed by Oluwatobiloba Bamidele-Nelly

GitHub:
https://github.com/Tbnelly


---

