# Angular Spring Boot Application with MS SQL

A full-stack web application with Angular 21 frontend, Spring Boot 3.2 backend with Spring Security, and MS SQL Server database.

## Features

- **Frontend (Angular 21)**
  - Modern standalone components architecture
  - JWT-based authentication
  - Routing with route guards
  - HTTP interceptors for automatic token injection
  - Responsive UI with custom CSS
  - Login, Register, Dashboard, and User Management pages

- **Backend (Spring Boot 3.2)**
  - RESTful API with Spring Web
  - Spring Security with JWT authentication
  - JPA/Hibernate for database operations
  - MS SQL Server integration
  - Password encryption with BCrypt
  - CORS configuration for Angular frontend
  - Input validation

## Technology Stack

### Frontend
- Angular 21
- TypeScript 5.7
- RxJS 7.8
- Angular Router
- Angular Forms

### Backend
- Java 17
- Spring Boot 3.2.1
- Spring Security
- Spring Data JPA
- MS SQL Server
- JWT (JSON Web Tokens)
- Maven
- Lombok

## Prerequisites

- Node.js 18+ and npm
- Java 17+
- Maven 3.8+
- MS SQL Server (local or remote)

## Database Setup

1. Install MS SQL Server or have access to a SQL Server instance

2. Create a new database:
```sql
CREATE DATABASE angular_springboot_db;
```

3. Update database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=angular_springboot_db;encrypt=true;trustServerCertificate=true
spring.datasource.username=your_username
spring.datasource.password=your_password
```

Note: The application will automatically create the required tables on first run due to `spring.jpa.hibernate.ddl-auto=update`.

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

The backend will start on http://localhost:8080

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will start on http://localhost:4200

## API Endpoints

### Authentication Endpoints (Public)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### User Endpoints (Protected - Requires JWT)
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `DELETE /api/users/{id}` - Delete user

## Project Structure

```
angular-springboot-app/
├── frontend/                    # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # Feature components
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── dashboard/
│   │   │   │   └── users/
│   │   │   ├── services/       # Angular services
│   │   │   ├── guards/         # Route guards
│   │   │   ├── interceptors/   # HTTP interceptors
│   │   │   └── app.routes.ts  # Route configuration
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                     # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/springboot/
│   │   │   │   ├── config/        # Security & CORS config
│   │   │   │   ├── controller/    # REST controllers
│   │   │   │   ├── dto/           # Data Transfer Objects
│   │   │   │   ├── entity/        # JPA entities
│   │   │   │   ├── repository/    # JPA repositories
│   │   │   │   ├── security/      # JWT & security classes
│   │   │   │   └── service/       # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
└── README.md
```

## Usage

1. Start the MS SQL Server database
2. Start the Spring Boot backend (port 8080)
3. Start the Angular frontend (port 4200)
4. Open browser and navigate to http://localhost:4200
5. Register a new user account
6. Login with your credentials
7. Access the dashboard and user management features

## Authentication Flow

1. User registers with username, email, and password
2. Password is encrypted with BCrypt and stored in database
3. User logs in with username and password
4. Backend validates credentials and returns JWT token
5. Frontend stores token in localStorage
6. All subsequent API requests include JWT token in Authorization header
7. Backend validates token on each protected endpoint request

## Security Features

- Passwords encrypted with BCrypt
- JWT-based stateless authentication
- Route guards prevent unauthorized access
- HTTP-only sessions (stateless)
- CORS configured for specific origin
- Input validation on both frontend and backend
- SQL injection prevention with JPA

## Development

### Adding New Features

1. **Frontend**: Create new components in `frontend/src/app/components/`
2. **Backend**: Add controllers in `backend/src/main/java/com/example/springboot/controller/`
3. Update routes and services as needed

### Environment Configuration

Update `application.properties` for different environments (dev, prod, test).

## Troubleshooting

### Database Connection Issues
- Verify MS SQL Server is running
- Check connection string in application.properties
- Ensure database exists
- Verify credentials

### CORS Errors
- Check `cors.allowed.origins` in application.properties
- Ensure Angular dev server is running on configured port

### JWT Token Issues
- Verify token is being sent in Authorization header
- Check token expiration (default: 24 hours)
- Ensure JWT secret is configured

## License

MIT License
