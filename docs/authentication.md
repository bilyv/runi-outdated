# Authentication System

## Overview
The application uses Convex Authentication with a Password provider. This provides a secure email/password authentication system for business users.

## Implementation Details

### Authentication Provider
- **Provider**: Convex Authentication with Password provider
- **Method**: Email/password authentication
- **Session Management**: Automatic session handling through Convex

### Key Files
- `convex/auth.config.ts`: Authentication configuration
- `convex/auth.ts`: Custom authentication actions
- `src/features/auth/`: Frontend authentication components

### Authentication Flow

#### Sign Up
1. User visits the application
2. If not authenticated, redirected to sign-up page
3. User completes multi-step registration form:
   - Business name
   - Business email
   - Full name
   - Phone number
   - Password (with confirmation)
4. Account is created immediately upon form submission
5. User is automatically signed in and redirected to dashboard

#### Sign In
1. User visits the application
2. If not authenticated, redirected to sign-in page
3. User enters business email and password
4. Credentials are verified against stored hashed passwords
5. Session created and user redirected to dashboard

#### Password Reset
1. User clicks "Forgot Password" on sign-in page
2. User enters business email address
3. Password reset instructions sent to email (if implemented)
4. User follows instructions to reset password

### Protected Routes
All application routes are protected using Convex's `Authenticated` and `Unauthenticated` components:
- `Authenticated`: Wraps protected content accessible only to signed-in users
- `Unauthenticated`: Wraps content visible only to guests (sign-in/sign-up pages)

### Session Handling
- Automatic session persistence across browser sessions
- Token refresh handled by Convex SDK
- Session invalidation on logout

### User Data
User data is stored in the `users` table and includes:
- Full name
- Email address
- Business information
- Phone number
- Account creation timestamp

### Security Features
- Password hashing (handled by Convex Authentication)
- Session encryption
- CSRF protection
- Rate limiting on authentication attempts
- Secure cookie management
- Input validation on all authentication forms

### Logout Process
1. User clicks "Log Out" in profile dropdown
2. Convex `signOut` action is called
3. Session is invalidated
4. User redirected to sign-in page