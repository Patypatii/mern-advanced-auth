# MERN Advanced Authentication

A MERN stack authentication system with features including user signup, login, email verification, password reset (forgot/reset), welcome email, and logout.

## Features

- **Signup & Login:** Secure authentication with JWT.
- **Email Verification:** Validate user emails via token.
- **Password Reset:** Forgot password and reset password functionality.
- **Welcome/Logout Emails:** Automatic email notifications on signup and password reset.

## Setup

### Prerequisites

- Node.js (v14+)
- MongoDB 
- An SMTP/email service (e.g., used mailtrap for this project)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Patypatii/mern-advanced-auth.git
   cd mern-advanced-auth
   ```

2. **Backend Setup:**

   ```bash
   cd backend
   npm install
   ```

   - Create a `.env` file with:
     ```
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     EMAIL_HOST=smtp.your-email-provider.com
     EMAIL_USER=your_email_username
     EMAIL_PASS=your_email_password
     CLIENT_URL=http://localhost:3000
     ```
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup:**

   ```bash
   cd ../frontend
   npm install
   npm start
   ```

## API Endpoints

- **POST `/api/auth/signup`** – Register a new user.
- **POST `/api/auth/login`** – Login and receive a JWT.
- **GET `/api/auth/verify-email/:token`** – Verify email with a token.
- **POST `/api/auth/forgot-password`** – Request a password reset.
- **POST `/api/auth/reset-password/:token`** – Reset password using token.
- **POST `/api/auth/logout`** – Logout the user.

---
