

**Full-Stack Web Authentication and Thumbnail Backend System**
===========================================================

**Overview**
------------

This is a full-stack web authentication and thumbnail backend system built using Node.js, Fastify, MongoDB, and Mongoose. The system provides a robust authentication mechanism with features such as login, register, logout, reset password, and forgot password.

**Features**
------------

* **Authentication**:
	+ Login: Authenticate users with username and password
	+ Register: Create new user accounts
	+ Logout: Log out authenticated users
* **Password Management**:
	+ Reset Password: Allow users to reset their passwords
	+ Forgot Password: Send password reset links to users via email
* **Thumbnail Generation**: Generate thumbnails for uploaded images

**Tech Stack**
-------------

* **Backend**:
	+ Node.js: JavaScript runtime environment
	+ Fastify: Fast and low-overhead web framework
	+ MongoDB: NoSQL database for storing user data
	+ Mongoose: Object Data Modeling (ODM) library for MongoDB
* **Frontend**:
	+ (Not included in this repository, but can be integrated with a frontend framework of your choice)

**Getting Started**
-------------------

### Prerequisites

* Node.js (>= 14.17.0)
* MongoDB (>= 4.4.0)
* Fastify (>= 3.25.0)
* Mongoose (>= 5.13.0)

### Installation

1. Clone the repository: `git clone https://github.com/your-username/your-repo-name.git`
2. Install dependencies: `npm install` or `yarn install`
3. Start the server: `npm start` or `yarn start`

### API Endpoints
-----------------

### Authentication

* **POST /login**: Authenticate user with username and password
* **POST /register**: Create new user account
* **POST /logout**: Log out authenticated user

### Password Management

* **POST /reset-password**: Reset user password
* **POST /forgot-password**: Send password reset link to user via email

### Thumbnail Generation

* **POST /generate-thumbnail**: Generate thumbnail for uploaded image

### Example Use Cases
--------------------

* **Login**:
```bash
curl -X POST \
  http://localhost:3000/login \
  -H 'Content-Type: application/json' \
  -d '{"username": "johnDoe", "password": "password123"}'
```
* **Register**:
```bash
curl -X POST \
  http://localhost:3000/register \
  -H 'Content-Type: application/json' \
  -d '{"username": "janeDoe", "password": "password123", "email": "jane@example.com"}'
```
* **Reset Password**:
```bash
curl -X POST \
  http://localhost:3000/reset-password \
  -H 'Content-Type: application/json' \
  -d '{"username": "johnDoe", "newPassword": "newPassword123"}'
```

**License**
-------

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

**Contributing**
------------

Contributions are welcome! Please submit a pull request with your changes.