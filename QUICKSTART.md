# Quick Start Guide - Cooperative Savings & Credit Society System

## Getting Started (5 Minutes)

### Step 1: Open the System
- Open `index.html` in your web browser
- You should see the Dashboard with sample data loaded

### Step 2: Explore the Dashboard
- You'll see 4 stat cards showing:
  - Total Members
  - Total Savings
  - Outstanding Loans
  - Recent Transactions
- Two charts display member growth and savings vs loans

### Step 3: Add Your First Member
1. Click **Members** in the left sidebar
2. Click **Add Member** button (top right)
3. Fill in the form:
   - Full Name: *required
   - Email: *required
   - Phone: *required
   - Address: optional
   - Occupation: optional
4. Click **Save Member**
5. The new member appears in the members table

### Step 4: Record a Savings Transaction
1. Click **Savings** in the sidebar
2. Click **New Savings** button
3. Fill in the form:
   - Member: select from dropdown
   - Type: Choose "Deposit" or "Withdrawal"
   - Amount: Enter amount
   - Date: Select date
   - Description: optional
4. Click **Save Transaction**
5. Transaction appears in savings table and is logged in transactions history

### Step 5: Create a Loan
1. Click **Loans** in the sidebar
2. Click **New Loan Application** button
3. Fill in the form:
   - Member: select from dropdown
   - Loan Amount: enter amount
   - Interest Rate: e.g., 10%
   - Tenor: e.g., 12 months
   - Purpose: optional
4. Click **Submit Application**
5. Loan appears with "Pending" status

### Step 6: Approve and Disburse a Loan
1. In the Loans table, find your loan
2. Click **Approve** button (for pending loans)
3. Click **Disburse** button (for approved loans)
4. Loan status updates and transaction is recorded

### Step 7: View Transaction History
1. Click **Transactions** in the sidebar
2. See all recorded transactions
3. Filter by:
   - Type: Deposit, Withdrawal, Loan, Payment
   - Date: Select specific date
   - Search: Member name or transaction ID
4. Click **Export** to download as CSV

### Step 8: Generate Reports
1. Click **Reports** in the sidebar
2. Choose report type:
   - Monthly Report
   - Member Report
   - Loan Report
   - Financial Summary
3. Click **Generate** to create report

### Step 9: Configure Settings
1. Click **Settings** in the sidebar
2. Update Organization Settings:
   - Organization Name
   - Email
   - Phone
   - Address
3. Update System Settings:
   - Default Interest Rate (%)
   - Minimum Loan Amount ($)
   - Maximum Loan Amount ($)
4. Click **Save Settings**

## Common Tasks

### Search for a Member
- Go to Members page
- Type in search box to find by name, email, or phone
- Use Status dropdown to filter active/inactive

### Find Member's Savings
- Go to Savings page
- Type member name in search box
- Filter by Deposit or Withdrawal

### Track a Loan Status
- Go to Loans page
- Search by member name
- Filter by status (Pending, Approved, Disbursed, Paid)

### Export Data for Backup
- Go to Transactions page
- Click **Export** button
- CSV file downloads with all transactions

## Tips & Tricks

✓ **Tip 1**: The system loads with sample data. You can delete sample records and add your own.

✓ **Tip 2**: All data is saved automatically in your browser's local storage.

✓ **Tip 3**: Use search and filter options to quickly find members and transactions.

✓ **Tip 4**: The sidebar collapses on mobile devices - click the menu icon to open it.

✓ **Tip 5**: All modals can be closed by clicking the X button or clicking outside the modal.

✓ **Tip 6**: Member options in dropdowns are automatically updated when you add new members.

✓ **Tip 7**: Savings and loan transactions are automatically logged in transaction history.

✓ **Tip 8**: Regular backups recommended - export transactions frequently!

## Dashboard Icons

- 📊 **Dashboard** - Overview and statistics
- 👥 **Members** - Manage cooperative members
- 💰 **Savings** - Track member savings
- 💳 **Loans** - Manage loan applications
- 🔄 **Transactions** - View transaction history
- 📄 **Reports** - Generate financial reports
- ⚙️ **Settings** - Configure system

## Data Entry Best Practices

1. **Member Registration**
   - Verify email addresses are correct
   - Ensure phone numbers are in consistent format
   - Keep member records up to date

2. **Savings Transactions**
   - Record transaction date accurately
   - Always specify transaction type
   - Add descriptions for tracking

3. **Loan Management**
   - Set appropriate interest rates
   - Record loan tenor in months
   - Document loan purpose

4. **Regular Backups**
   - Export transactions monthly
   - Save CSV files in secure location
   - Keep backup records

## Frequently Asked Questions

**Q: Where is my data stored?**
A: All data is stored in your browser's local storage. It persists until you clear your browser cache.

**Q: How do I backup my data?**
A: Go to Transactions page and click Export to download a CSV file with all transactions.

**Q: Can multiple people use this system?**
A: This version is single-user. All users would share the same data. For multi-user support, upgrade to the server version.

**Q: What if I accidentally delete a record?**
A: Unfortunately, there's no undo function. Be careful when deleting. Regular backups help recover from accidents.

**Q: Can I import data from Excel?**
A: The current version doesn't support imports. Manually enter data or contact support for custom solutions.

**Q: How do I print reports?**
A: Use your browser's Print function (Ctrl+P or Cmd+P) while viewing the reports page.

**Q: Is this system secure for real money?**
A: No. This is a demonstration system. For production use with real money, implement proper security measures.

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move between form fields |
| Enter | Submit form |
| Escape | Close modal dialog |
| Ctrl+P | Print page |

## Mobile Usage

- The system is responsive and works on phones and tablets
- Click the menu icon (☰) to open the sidebar
- Scroll horizontally on tables if needed
- Use touch-friendly buttons for navigation

## Next Steps

1. Clear sample data and add your cooperative members
2. Establish member accounts with initial savings
3. Set up your loan policies in Settings
4. Create loan products for different purposes
5. Start recording daily transactions
6. Generate monthly reports for records
7. Train other staff on the system
8. Plan for backup and data security

## Support Resources

- 📖 Full documentation: See README.md
- 💡 Feature overview: Check sidebar navigation
- 🐛 Issue reporting: Note exact steps to reproduce

---

**Happy Banking!** 🏦

For more detailed information, refer to the complete README.md file.
