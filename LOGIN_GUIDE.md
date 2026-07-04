# Login System Guide

## Overview

The Cooperative Savings & Credit Society System now includes a user authentication system with login, session management, and role-based user types.

## Getting Started

### First Time Access

1. Open `login.html` in your web browser
2. The page displays three demo accounts you can use
3. Enter credentials and click "Sign In"

### Demo Accounts

Three demo accounts are pre-configured for testing:

#### 1. Admin Account
- **Email**: admin@coopsociety.org
- **Password**: admin123
- **Role**: Admin
- **Access**: Full system access, all features

#### 2. Officer Account
- **Email**: officer@coopsociety.org
- **Password**: officer123
- **Role**: Officer
- **Access**: Members, savings, loans, transactions management

#### 3. Member Account
- **Email**: member@coopsociety.org
- **Password**: member123
- **Role**: Member
- **Access**: View own account, limited features

## Login Features

### Login Page Elements

**Email Field**
- Required field
- Enter your registered email address
- Accepts any valid email format

**Password Field**
- Required field
- Click the eye icon to toggle password visibility
- Password is masked by default

**Remember Me Checkbox**
- Optional checkbox
- When checked, your email is remembered for next login
- Email appears automatically on next visit

**Forgot Password Link**
- Click to recover forgotten passwords
- (Demo: Shows hint of current password)

**Demo Accounts Section**
- Displays all available demo credentials
- Easy reference for testing

**Sign In Button**
- Submits login form
- Shows loading state during login
- Redirects to dashboard on success

### Navigation

- **Create Account**: Demo link (would be signup form in production)
- After successful login: Redirects to main dashboard

## Session Management

### Session Details

When you login successfully:
- Session is created and stored in browser's local storage
- Session includes:
  - User ID
  - User Name
  - Email Address
  - User Role
  - Login Time

### Session Display

The main dashboard header shows:
- Welcome message with your name
- Your user role
- User avatar
- User menu dropdown

### Session Security

- Sessions persist in browser local storage
- Clearing browser data will clear your session
- Auto-redirect to login if session expires
- Single session per browser

## User Menu

### Accessing User Menu

Click the dropdown arrow next to your name in the top-right corner

### Menu Options

**Profile**
- View your account information
- Shows name, email, role, and login time
- (Full version would allow editing)

**Change Password**
- Change your login password
- (Demo: Shows message that feature is coming)

**Settings**
- Navigate to system settings
- Configure organization parameters
- Only accessible by admins

**Logout**
- Safely end your session
- Click "Logout" to sign out
- Redirects to login page

## Login Best Practices

### Security Tips

✓ **Do's:**
- Use a strong, unique password
- Log out when finished
- Use "Remember Me" only on personal devices
- Change password regularly (in production)
- Report suspicious login attempts

✗ **Don'ts:**
- Share your login credentials
- Write down passwords
- Use simple passwords
- Log out on shared computers
- Stay logged in indefinitely

### Password Management

**Remember Me Feature:**
- Saves email only, not password
- Email appears on login form automatically
- Still requires entering password each time
- Safe for personal computers

**Forgetting Password:**
- Use "Forgot Password" link
- (Demo: Shows password hint)
- Contact admin if still unable to login

## Troubleshooting

### Can't Login

**Problem**: Invalid email or password error
- **Solution**: Double-check email and password spelling
- **Check**: Use demo accounts to verify login works
- **Try**: Copy-paste demo credentials

**Problem**: Page redirects to login immediately
- **Solution**: Session may have expired
- **Try**: Login again with credentials

**Problem**: Email remembered but login fails
- **Solution**: Clear remembered email and try again
- **How**: Uncheck "Remember Me" checkbox

### Password Issues

**Problem**: Forgot password
- **Solution**: Click "Forgot Password" link
- **Demo**: Shows password hint (admin123)

**Problem**: Can't see password being typed
- **Solution**: Click eye icon to toggle visibility

## System Roles

### Admin
- Full system access
- Manage all members
- Process all transactions
- Approve/disburse loans
- Access all reports
- Configure system settings
- Manage user accounts

### Officer
- Manage members
- Record savings transactions
- Process loan applications
- View transaction history
- Generate reports
- Limited settings access

### Member
- View own account
- Make savings deposits
- View transaction history
- Apply for loans
- (Limited to own data)

## Features by Role

| Feature | Admin | Officer | Member |
|---------|-------|---------|--------|
| Add Members | ✓ | ✓ | ✗ |
| Edit Members | ✓ | ✓ | ✗ |
| Record Savings | ✓ | ✓ | ✓ |
| Apply for Loans | ✓ | ✓ | ✓ |
| Approve Loans | ✓ | ✓ | ✗ |
| View Reports | ✓ | ✓ | ✗ |
| Settings | ✓ | ✗ | ✗ |

## Session Workflow

### Login Flow

```
1. User opens login.html
2. Checks if already logged in
   - If yes → Redirects to dashboard
   - If no → Shows login form
3. User enters credentials
4. System validates credentials
5. On success → Creates session
6. Session stored in localStorage
7. Redirects to index.html
8. App checks session and loads
```

### Logout Flow

```
1. User clicks Logout
2. Confirmation dialog appears
3. If confirmed → Session removed
4. localStorage cleared
5. Redirects to login.html
6. User must login again to access
```

## Data Persistence

### What's Saved

- **Session Data**: Stored in localStorage
- **Application Data**: Stored in localStorage
- **Remembered Email**: Stored in localStorage (if Remember Me checked)

### What's Lost on Logout

- Current session
- Browser navigation history to app
- Temporary data

### What's NOT Lost

- Application data (members, savings, loans)
- Other local storage data
- Browser history
- Cookies

## Advanced Topics

### Role-Based Access (Future)

In production version:
- Dashboard customization by role
- Feature visibility based on role
- Data access restrictions
- Audit logging of actions

### Session Timeout (Future)

In production version:
- Automatic logout after inactivity
- Warning before session expires
- Session extension on activity
- Secure session invalidation

### Multi-Device Support (Future)

Planned enhancements:
- Multiple concurrent sessions
- Device management
- Session monitoring
- Remote logout capability

## Support

### Common Questions

**Q: Can I create my own account?**
A: Demo shows how it would work. Full version includes signup.

**Q: What if I forget my password?**
A: Click "Forgot Password" link for recovery process.

**Q: How long does session last?**
A: Session persists until you logout or clear browser cache.

**Q: Can I login from multiple devices?**
A: Yes, but each device has separate session.

**Q: Is my password encrypted?**
A: Demo stores in plain text. Production would use encryption.

### Contacting Support

For login issues or questions:
- Refer to this documentation
- Check browser console for errors (F12)
- Verify demo credentials work first
- Contact system administrator

---

**Document Version**: 1.0.0
**Last Updated**: June 2026

For more information, see:
- [README.md](README.md) - Full system documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [FEATURES.md](FEATURES.md) - Feature specifications
