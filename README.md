# Cooperative Savings & Credit Society System

A comprehensive web-based management system for cooperative savings and credit societies. This application provides features for managing members, tracking savings, managing loans, and generating financial reports.

## Features

### 1. Dashboard
- Real-time statistics overview
- Total members count
- Total savings amount
- Outstanding loans tracking
- Recent transactions count
- Visual charts for member growth and savings vs loans

### 2. Member Management
- Add new members with detailed information
- Edit existing member records
- Delete members
- Search and filter members by name, email, or phone
- Filter by member status (active/inactive)
- View individual member savings

### 3. Savings Management
- Record member deposits and withdrawals
- Track savings transactions by member
- View running savings balance
- Filter savings by type (deposit/withdrawal)
- Search savings history
- Automatic transaction logging

### 4. Loan Management
- Process loan applications
- Approve pending loans
- Disburse approved loans
- Track loan status (pending, approved, disbursed, paid)
- Monitor interest rates and tenor
- View loan purposes

### 5. Transaction History
- Complete transaction audit trail
- Filter by transaction type (deposit, withdrawal, loan, payment)
- Search by member or transaction ID
- Filter by date
- Export transactions to CSV

### 6. Reports
- Monthly financial reports
- Member account statements
- Loan status reports
- Financial summary reports
- PDF and Excel export capabilities

### 7. Settings
- Organization configuration
- System parameters
- Default interest rates
- Minimum/maximum loan amounts

## System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Local storage support for data persistence

## Installation

1. Download all files to a directory
2. Ensure the following folder structure:
   ```
   savings/
   ├── index.html
   ├── asset/
   │   ├── style.css
   │   ├── responsive.css
   │   └── app.js
   ```

3. Open `index.html` in a web browser

## Usage

### Adding a Member
1. Click "Members" in the sidebar
2. Click "Add Member" button
3. Fill in member details
4. Click "Save Member"

### Recording Savings
1. Click "Savings" in the sidebar
2. Click "New Savings" button
3. Select member
4. Choose transaction type (deposit/withdrawal)
5. Enter amount and date
6. Click "Save Transaction"

### Creating a Loan
1. Click "Loans" in the sidebar
2. Click "New Loan Application"
3. Select member
4. Enter loan amount, interest rate, and tenor
5. Click "Submit Application"
6. Approve or disburse from the loans table

### Viewing Reports
1. Click "Reports" in the sidebar
2. Choose report type
3. Click "Generate" to create the report

### Configuring Settings
1. Click "Settings" in the sidebar
2. Update organization or system settings
3. Click "Save Settings"

## Data Storage

All data is stored in the browser's local storage. This means:
- Data persists between browser sessions
- Data is specific to each browser/computer
- Clearing browser cache will delete all data
- Recommended to regularly export transactions for backup

## Features Breakdown

### Member Information Stored
- Full name
- Email address
- Phone number
- Physical address
- Occupation
- Membership status
- Join date

### Savings Transaction Fields
- Transaction ID
- Member ID
- Type (deposit/withdrawal)
- Amount
- Date
- Description
- Status

### Loan Information
- Loan ID
- Member ID
- Loan amount
- Interest rate
- Tenor (months)
- Purpose
- Application date
- Status

### Transaction Recording
- Transaction ID
- Date
- Member
- Type
- Amount
- Reference ID
- Status

## Keyboard Shortcuts

- Use Tab to navigate form fields
- Press Enter to submit forms
- Escape to close modals

## Default Settings

- Default Interest Rate: 10%
- Minimum Loan Amount: $500
- Maximum Loan Amount: $50,000

## Sample Data

The system includes sample data on first load:
- 2 sample members
- 2 sample savings transactions
- 1 sample loan

You can clear this data by deleting individual records.

## Responsive Design

The system is fully responsive and works on:
- Desktop computers (1920px and above)
- Tablets (768px to 1024px)
- Mobile phones (320px to 768px)
- Landscape and portrait orientations

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security Notes

⚠️ This is a demonstration system. For production use:
- Implement server-side authentication
- Use secure password hashing
- Encrypt sensitive data
- Implement access controls
- Use HTTPS
- Regular security audits
- Database backup solutions

## Troubleshooting

### Data not persisting
- Check if local storage is enabled in your browser
- Ensure cookies/storage are not being cleared on exit

### Charts not displaying
- Ensure Chart.js library is loaded from CDN
- Check browser console for errors
- Try clearing cache and reloading

### Modal not closing
- Click the X button or outside the modal
- Press Escape key

### Search not working
- Ensure search text matches member names or details
- Clear filters to see all records

## Future Enhancements

- User authentication and roles
- Multi-user support
- Database integration
- Email notifications
- SMS alerts
- Advanced financial calculations
- Interest accrual system
- Dividend calculations
- Meeting scheduler
- Document management
- Mobile app version
- Payment gateway integration

## Support

For issues or questions, please refer to the system documentation or contact your administrator.

## License

This Cooperative Savings & Credit Society System is provided as-is for demonstration and educational purposes.

## Version

System Version: 1.0.0
Last Updated: June 2026

---

**Remember**: Regular backups of your transaction data are recommended. Use the "Export" feature to create CSV backups of your transactions.
