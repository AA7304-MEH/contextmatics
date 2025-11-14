# Authentication System Documentation 🔐

## Overview
A modern, secure authentication system with multiple sign-in options, matching the clean SaaS design of the landing page.

## Features

### 1. Multiple Authentication Methods
- ✅ **Email & Password** - Traditional authentication
- ✅ **Google OAuth** - Sign in with Google
- ✅ **GitHub OAuth** - Sign in with GitHub  
- ✅ **Microsoft OAuth** - Sign in with Microsoft

### 2. User Experience
- Clean, minimal design matching landing page
- Smooth transitions and animations
- Loading states for all actions
- Error handling with user-friendly messages
- Toggle between login and signup
- Auto-redirect after successful authentication

### 3. Security Features
- Password input masking
- Secure form submission
- Protected routes (redirects to dashboard if authenticated)
- Terms of Service and Privacy Policy links
- Encrypted data messaging

## Design System

### Colors
```css
Background: #ffffff (white)
Card Background: white with subtle border
Primary Button: #2563eb (blue)
Text Primary: #111827 (dark gray)
Text Secondary: #6b7280 (medium gray)
Error: #dc2626 (red)
Border: #e5e7eb (light gray)
```

### Layout
```css
Max Width: 480px (centered)
Card Padding: 2.5rem
Border Radius: 16px (cards), 8px (inputs/buttons)
Spacing: Consistent 0.75rem - 1.5rem gaps
```

### Typography
```css
Heading: 2.5rem, bold
Body: 1rem, regular
Labels: 0.875rem, medium weight
Small Text: 0.75rem
```

## Routes

### Authentication Routes
- `/auth` - Main authentication page
- `/login` - Alias for auth page (login mode)
- `/signup` - Alias for auth page (signup mode)

### Protected Routes
- `/dashboard` - User dashboard (requires auth)
- `/settings` - User settings (requires auth)
- `/history` - Content history (requires auth)
- `/subscription` - Subscription management (requires auth)

## Component Structure

### Auth.tsx
Main authentication component with:
- State management for login/signup toggle
- Form handling for email/password
- Social authentication handlers
- Error state management
- Loading states
- Auto-redirect logic

### Key States
```typescript
isLogin: boolean          // Toggle between login/signup
email: string            // User email input
password: string         // User password input
name: string            // User name (signup only)
loading: boolean        // Loading state
error: string           // Error message
scrolled: boolean       // Navigation scroll state
```

## Authentication Flow

### Email/Password Flow
1. User enters credentials
2. Form validation
3. Loading state activated
4. API call simulated (1 second delay)
5. Success: Redirect to dashboard
6. Error: Display error message

### Social Authentication Flow
1. User clicks social button
2. Loading state activated
3. OAuth flow simulated (1.5 second delay)
4. Success: Create user session
5. Redirect to dashboard
6. Error: Display provider-specific error

## Integration Points

### AuthContext Integration
```typescript
const { signup, isAuthenticated } = useAuth();

// Signup/Login
await signup(email, countryCode, visitorId, userData);

// Check authentication
if (isAuthenticated) {
  navigate('/dashboard');
}
```

### Navigation Integration
```typescript
// From landing page
<button onClick={() => navigate('/auth')}>
  Login
</button>

// From auth page
<button onClick={() => navigate('/')}>
  Home
</button>
```

## Form Validation

### Email Field
- Type: email
- Required: Yes
- Placeholder: "you@example.com"
- Validation: HTML5 email validation

### Password Field
- Type: password
- Required: Yes
- Placeholder: "••••••••"
- Masked input

### Name Field (Signup Only)
- Type: text
- Required: Yes (signup only)
- Placeholder: "John Doe"

## Error Handling

### Error Display
- Red background (#fef2f2)
- Red border (#fecaca)
- Red text (#dc2626)
- Clear, user-friendly messages

### Error Types
```typescript
'Authentication failed. Please try again.'
'Google authentication failed. Please try again.'
'GitHub authentication failed. Please try again.'
'Microsoft authentication failed. Please try again.'
```

## Responsive Design

### Mobile (< 640px)
- Full-width form
- Stacked social buttons
- Reduced padding
- Touch-friendly buttons (min 44px height)

### Tablet (640px - 1024px)
- Centered form (max 480px)
- Comfortable spacing
- Readable typography

### Desktop (> 1024px)
- Centered form (max 480px)
- Hover states on buttons
- Optimal spacing

## Accessibility

### Features
- Semantic HTML (form, label, input)
- Proper label associations
- Focus states on inputs
- Keyboard navigation support
- ARIA attributes (implicit)
- High contrast text
- Touch-friendly targets

### Focus States
- Blue border on input focus (#2563eb)
- Visual feedback on all interactive elements
- Tab navigation support

## Social Authentication Icons

### Google
- Multi-color official Google logo
- SVG format for crisp rendering
- Proper brand colors

### GitHub
- Official GitHub Octocat icon
- Monochrome (inherits text color)
- SVG format

### Microsoft
- Official Microsoft logo (4 squares)
- Brand colors (red, green, blue, yellow)
- SVG format

## Button States

### Default State
```css
Background: white
Border: 1px solid #e5e7eb
Color: #111827
Cursor: pointer
```

### Hover State
```css
Background: #f9fafb
Transition: 0.2s
```

### Loading State
```css
Opacity: 0.6
Cursor: not-allowed
Disabled: true
```

### Primary Button
```css
Background: #2563eb
Color: white
Hover: #1d4ed8
```

## Security Considerations

### Current Implementation (Demo)
- Simulated API calls
- Mock authentication
- Client-side only
- No real password storage

### Production Requirements
- Implement real OAuth flows
- Secure backend API
- Password hashing (bcrypt)
- JWT tokens
- HTTPS only
- CSRF protection
- Rate limiting
- Session management
- Secure cookie storage

## Future Enhancements

### Additional Features
1. **Password Reset**
   - Forgot password link
   - Email verification
   - Reset token system

2. **Email Verification**
   - Verification email
   - Confirmation link
   - Resend verification

3. **Two-Factor Authentication**
   - SMS verification
   - Authenticator app
   - Backup codes

4. **Social Providers**
   - Twitter/X
   - LinkedIn
   - Apple Sign In
   - Facebook

5. **Account Management**
   - Change password
   - Update email
   - Delete account
   - Export data

6. **Session Management**
   - Remember me
   - Multiple devices
   - Active sessions list
   - Logout all devices

## Testing Checklist

### Functionality
- [ ] Email login works
- [ ] Email signup works
- [ ] Google auth works
- [ ] GitHub auth works
- [ ] Microsoft auth works
- [ ] Toggle login/signup works
- [ ] Error messages display
- [ ] Loading states show
- [ ] Redirect after auth works
- [ ] Form validation works

### UI/UX
- [ ] Design matches landing page
- [ ] Gradient orbs visible
- [ ] Navigation works
- [ ] Buttons have hover states
- [ ] Inputs have focus states
- [ ] Mobile responsive
- [ ] Tablet responsive
- [ ] Desktop responsive

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus visible
- [ ] Labels associated
- [ ] Touch targets adequate
- [ ] Color contrast sufficient
- [ ] Screen reader friendly

## Usage Examples

### Navigate to Auth Page
```typescript
// From any component
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/auth');
```

### Check Authentication Status
```typescript
import { useAuth } from '../context/AuthContext';

const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {
  console.log('User:', user);
}
```

### Logout
```typescript
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  navigate('/');
};
```

## API Integration (Future)

### Backend Endpoints Needed
```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/refresh

OAuth Endpoints:
GET  /api/auth/google
GET  /api/auth/google/callback
GET  /api/auth/github
GET  /api/auth/github/callback
GET  /api/auth/microsoft
GET  /api/auth/microsoft/callback
```

### Request/Response Format
```typescript
// Login Request
{
  email: string;
  password: string;
}

// Login Response
{
  user: {
    id: string;
    email: string;
    name: string;
    plan: string;
  };
  token: string;
}
```

## Environment Variables

### Required for Production
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id
VITE_API_URL=https://api.yourapp.com
```

## Live URLs

### Development
- Auth Page: http://localhost:3000/#/auth
- Login: http://localhost:3000/#/login
- Signup: http://localhost:3000/#/signup

### After Authentication
- Dashboard: http://localhost:3000/#/dashboard
- Settings: http://localhost:3000/#/settings
- History: http://localhost:3000/#/history

## Summary

The authentication system provides:
- ✅ Modern, clean design
- ✅ Multiple sign-in options
- ✅ Excellent user experience
- ✅ Fully responsive
- ✅ Accessible
- ✅ Ready for production integration
- ✅ Matches landing page aesthetic

All authentication flows are currently simulated for demonstration. Integration with real OAuth providers and backend API is required for production use.
