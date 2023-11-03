
## REST API for VITBuzzBytes

VITBuzzBytes is a social media platform tailored for the VIT student community, providing a space for students to connect, share, and engage with each other. This app allows VIT students to post, discover, and discuss all the trending topics and events happening within the college campus.



## Getting Started

To get started with this project, follow these steps:

### Prerequisites

Before you begin, ensure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Installation
1. Clone this repository to your local machine:

   ```bash
   git clone <repository-url>

2. Navigate to the project directory:

   ```bash
    cd vitbuzzbytes-backend
3. Install dependencies:
    ```bash
    npm install

## Environment Variables

To configure your application, you will need to set the following environment variables:

1. `DATABASE` and `DATABASE_PASSWORD`: You have two options for setting up your database:
   - You can set up a local MongoDB server.
   - You can use MongoDB Atlas to host your database online.

2. `JWT_SECRET` and `JWT_EXPIRES_IN`: These values can be customized according to your preferences.


## Launching
to launch the application:
```bash
npm start
```
this will launch the application on http://127.0.0.1:3000 

# VITBuzzBytes API Endpoints (/api/v1)

## Buzz Endpoints (/buzzes)

### POST /post-buzz

Creates a new buzz.

**Requires Authentication(JWT)**

Request body must include:
- `text`: The content of the buzz.

### GET /view-buzzes

Retrieves all buzzes.

**Requires Authentication(JWT)**

### POST /:id/like

Likes a buzz with the specified ID.

**Requires Authentication(JWT)**

### POST /:id/dislike

Dislikes a buzz with the specified ID.

**Requires Authentication(JWT)**

### DELETE /:id

Deletes a buzz with the specified ID. Only user who created the buzz is allowed to delete it.

### POST /:id/comment

Adds a comment to a buzz with the specified ID.

**Requires Authentication(JWT)**

Request body should include:
- `comment`: The content of the comment.

### DELETE /:id/delete-comment/:commentid

Deletes a comment with the specified comment ID from a buzz with the specified buzz ID.Only user who created the comment is allowed to delete it.



**Requires Authentication(JWT)**

## User Endpoints(/users)

### POST /get-otp

Generates an OTP for a user.

Request body should include:
- `email`: The email of the user.

### POST /verify-otp

Verifies the OTP for a user.

Request body should include:
- `email`: The email of the user.
- `otp`: The OTP to verify.

### POST /signup

Registers a new user.

Request body should include:
- `email`: The email of the user.
- `password`: The password of the user.
- `confirmPassword`: The password confirmation.

### POST /login

Logs in a user.

Request body should include:
- `email`: The email of the user.
- `password`: The password of the user.

### GET /profile

Retrieves the profile of the currently authenticated user.

**Requires Authentication(JWT)**
