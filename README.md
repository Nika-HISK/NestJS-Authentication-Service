#  NestJS Authentication Service

This is a simple and modular authentication service built with **NestJS**, **MySQL**, and **TypeORM**. It includes user registration, login, and logout with **JWT-based authentication**, along with input validation using **Validation Pipes** and **class-transformer**.

---

##  Tech Stack

- **NestJS** – Progressive Node.js framework
- **TypeORM** – ORM for MySQL
- **MySQL** – Relational database for user storage
- **JWT** – JSON Web Tokens for authentication
- **class-validator & class-transformer** – For DTO validation and transformation
- **Validation Pipes** – Built-in NestJS feature for input validation
- **@nestjs/schedule** – For automated token cleanup

---

##  Features

- User registration & login
- **Secure logout with token blacklisting**
- JWT access token generation
- Secure password hashing
- Input validation using DTOs
- **Automatic cleanup of expired tokens**
- Role-based access control (USER/ADMIN)
- Modular structure with scalable practices

---

##  Development Setup

```bash
# Clone the repo
git clone https://github.com/Nika-HISK/NestJS-Authentication-Service.git
cd NestJS-Authentication-Service

# Install dependencies
npm install

# Run the app
npm run start:dev
```

---

##  API Endpoints

### **Authentication**

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Admin Login
```http
POST /auth/login/admin
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "AdminPass123"
}
```

#### **Logout (NEW)**
```http
POST /auth/logout
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "message": "Successfully logged out"
}
```

### **Users**

#### Get User by ID
```http
GET /users/:id
Authorization: Bearer <your-jwt-token>
```

#### Update User (Admin only)
```http
PATCH /users/:id
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "username": "newusername"
}
```

#### Delete User (Admin only)
```http
DELETE /users/:id
Authorization: Bearer <admin-jwt-token>
```

---

##  Authentication Flow

### **Login Process**
1. User provides email and password
2. System validates credentials
3. JWT token is generated and returned
4. Client stores token for future requests

### **Protected Requests**
1. Client sends token in `Authorization: Bearer <token>` header
2. System validates token signature and expiration
3. **Checks if token is blacklisted (logout protection)**
4. Verifies user exists and isn't banned
5. Validates user roles for endpoint access
6. Grants or denies access

### **Logout Process (NEW)**
1. Client sends authenticated logout request
2. System extracts token from authorization header
3. **Token is added to blacklist with expiration time**
4. Future requests with this token are rejected
5. **Expired blacklisted tokens are automatically cleaned up daily**

---

##  Security Features

- **Immediate Token Invalidation**: Logout instantly invalidates tokens
- **Password Hashing**: Uses bcrypt for secure password storage
- **Token Blacklisting**: Prevents reuse of logged-out tokens
- **Role-Based Access**: USER and ADMIN role separation
- **Input Validation**: Comprehensive DTO validation
- **Ban Protection**: Banned users cannot access the system
- **Automatic Cleanup**: Expired tokens removed from blacklist daily

---

##  Environment Variables

Create a `.env` file in your project root:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASS=your_password
DB_NAME=your_database

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_ACCESS_EXP=1h

# Application
PORT=3000
```

---

##  Testing the Logout Feature

### **Complete Test Flow:**

1. **Register a user:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123",
    "confirmPassword": "TestPass123"
  }'
```

2. **Login to get token:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

3. **Test protected route (should work):**
```bash
curl -X GET http://localhost:3000/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

4. **Logout:**
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

5. **Test protected route again (should fail):**
```bash
curl -X GET http://localhost:3000/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Result:** Step 5 should return `401 Unauthorized` with message "Token has been invalidated"

---

##  Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one number

---

##  Project Structure

```
src/
├── auth/
│   ├── entities/
│   │   └── token-blacklist.entity.ts    # NEW: Token blacklist storage
│   ├── guard/
│   │   ├── enum/
│   │   │   └── role.enum.ts
│   │   ├── jwt-auth.guard.ts            # UPDATED: Blacklist checking
│   │   ├── jwt-roles.guard.ts
│   │   └── jwt-strategy.ts
│   ├── dto/
│   │   └── login-user.dto.ts
│   ├── auth.controller.ts               
│   ├── auth.module.ts                  
│   ├── auth.service.ts                  
│   └── token-blacklist.service.ts       
├── users/
│   ├── entities/
│   │   └── user.entity.ts
│   ├── repositories/
│   │   └── users.repository.ts
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
├── Common/
│   └── base.entity.ts
├── app.controller.ts
├── app.module.ts                        # UPDATED: New entity
├── app.service.ts
└── main.ts
```
