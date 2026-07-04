// ===== DATA STORAGE =====
let appData = {
    members: [],
    savings: [],
    loans: [],
    transactions: [],
    settings: {
        orgName: 'The Bridge Micro Saving',
        orgEmail: 'info@coopsociety.org',
        orgPhone: '+1-800-123-4567',
        orgAddress: '123 Main Street, City, Country',
        defaultRate: 10,
        minLoan: 500,
        maxLoan: 50000
    }
};

let currentSession = null;
let currentMemberId = null;
let memberChartInstance = null;
let savingsChartInstance = null;

function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function ensureRequiredMembers() {
    const requiredMembers = [
        {
            id: 'M101',
            name: 'Lubega Umar',
            email: 'lubega@thebridgemicrosaving.com',
            phone: '+256700000001',
            address: 'Kampala',
            occupation: 'Administrator',
            status: 'active',
            joinDate: getTodayDateString()
        },
        {
            id: 'M102',
            name: 'Mercy',
            email: 'mercy@thebridgemicrosaving.com',
            phone: '+256700000002',
            address: 'Kampala',
            occupation: 'Treasurer',
            status: 'active',
            joinDate: getTodayDateString()
        },
        {
            id: 'M103',
            name: 'Semaganda Raymond',
            email: 'semaganda@thebridgemicrosaving.com',
            phone: '+256700000003',
            address: 'Mukono',
            occupation: 'Member',
            status: 'active',
            joinDate: getTodayDateString()
        },
        {
            id: 'M104',
            name: 'Kimera Abdul Hakim',
            email: 'kimera@thebridgemicrosaving.com',
            phone: '+256700000004',
            address: 'Jinja',
            occupation: 'Member',
            status: 'active',
            joinDate: getTodayDateString()
        },
        {
            id: 'M105',
            name: 'Aunt Betty',
            email: 'betty@thebridgemicrosaving.com',
            phone: '+256700000005',
            address: 'Masaka',
            occupation: 'Member',
            status: 'active',
            joinDate: getTodayDateString()
        }
    ];

    let changed = false;

    requiredMembers.forEach(member => {
        const existing = appData.members.find(existingMember => existingMember.email === member.email || existingMember.id === member.id);
        if (!existing) {
            appData.members.push(member);
            changed = true;
        }
    });

    if (changed) {
        saveData();
    }

    ensureStarterSavingsEntries();
}

function ensureStarterSavingsEntries() {
    const starterEntries = [
        { memberId: 'M101', amount: 500000, description: 'Opening savings deposit' },
        { memberId: 'M102', amount: 350000, description: 'Opening savings deposit' },
        { memberId: 'M103', amount: 250000, description: 'Opening savings deposit' },
        { memberId: 'M104', amount: 180000, description: 'Opening savings deposit' },
        { memberId: 'M105', amount: 220000, description: 'Opening savings deposit' }
    ];

    let changed = false;

    starterEntries.forEach(entry => {
        const hasSaving = appData.savings.some(saving => saving.memberId === entry.memberId && saving.description === entry.description);
        if (!hasSaving) {
            const savingId = 'S' + Date.now() + Math.random().toString(36).slice(2, 6);
            const transactionId = 'T' + Date.now() + Math.random().toString(36).slice(2, 6);
            const today = getTodayDateString();

            appData.savings.push({
                id: savingId,
                memberId: entry.memberId,
                type: 'deposit',
                amount: entry.amount,
                date: today,
                description: entry.description,
                status: 'completed'
            });

            appData.transactions.push({
                id: transactionId,
                date: today,
                memberId: entry.memberId,
                type: 'deposit',
                amount: entry.amount,
                reference: savingId,
                status: 'completed'
            });

            changed = true;
        }
    });

    if (changed) {
        saveData();
    }
}

// ===== SESSION MANAGEMENT =====
function initializeSession() {
    const sessionData = localStorage.getItem('coopSession');

    if (!sessionData) {
        window.location.replace('login.html');
        return false;
    }

    currentSession = JSON.parse(sessionData);
    updateUserInfo();
    return true;
}

function updateUserInfo() {
    if (currentSession) {
        document.getElementById('userWelcome').textContent = `Welcome, ${currentSession.userName}`;
        const roleLabel = currentSession.userRole === 'officer' ? 'Treasurer' : currentSession.userRole.charAt(0).toUpperCase() + currentSession.userRole.slice(1);
        document.getElementById('userRole').textContent = roleLabel;
    }
    applyRoleBasedAccess();
}

function getUserRole() {
    return currentSession?.userRole || 'member';
}

function isAdmin() {
    return getUserRole() === 'admin';
}

function isOfficer() {
    return getUserRole() === 'officer';
}

function getCurrentMemberRecord() {
    if (!currentSession?.userEmail) {
        return null;
    }

    return appData.members.find(member => member.email === currentSession.userEmail) || null;
}

function getVisibleTransactions() {
    const role = getUserRole();
    const currentMember = getCurrentMemberRecord();

    if (role === 'member' && currentMember && !canViewAllAccounts()) {
        return appData.transactions.filter(transaction => transaction.memberId === currentMember.id);
    }

    return appData.transactions;
}

function canManageMembers() {
    return isAdmin();
}

function canManageFinancialRecords() {
    return isAdmin() || isOfficer();
}

function canDepositToOwnAccount() {
    return !!getCurrentMemberRecord();
}

function canSeeAllMembers() {
    return isAdmin() || isOfficer();
}

function canViewAllAccounts() {
    return canSeeAllMembers();
}

function canViewMemberFinancialDetails() {
    return canViewAllAccounts();
}

function canAccessSettings() {
    return isAdmin();
}

function requirePermission(allowed, action) {
    if (!allowed) {
        alert(`You do not have permission to ${action}.`);
        return false;
    }
    return true;
}

function applyRoleBasedAccess() {
    const role = getUserRole();
    const allowedPages = role === 'admin'
        ? ['dashboard', 'members', 'savings', 'loans', 'transactions', 'reports', 'settings']
        : role === 'officer'
            ? ['dashboard', 'members', 'savings', 'loans', 'transactions', 'reports']
            : ['dashboard', 'members', 'savings', 'loans', 'transactions'];

    document.querySelectorAll('.nav-link').forEach(link => {
        const page = link.getAttribute('data-page');
        link.style.display = allowedPages.includes(page) ? '' : 'none';
    });

    const addMemberBtn = document.getElementById('addMemberBtn');
    const addSavingsBtn = document.getElementById('addSavingsBtn');
    const approveLoanBtn = document.getElementById('approveLoanBtn');

    if (addMemberBtn) {
        addMemberBtn.style.display = canManageMembers() ? '' : 'none';
    }
    if (addSavingsBtn) {
        addSavingsBtn.style.display = canManageFinancialRecords() || canDepositToOwnAccount() ? '' : 'none';
        addSavingsBtn.innerHTML = '<i class="fas fa-plus"></i> Add Saving';
    }
    if (approveLoanBtn) {
        approveLoanBtn.style.display = canManageFinancialRecords() ? '' : 'none';
    }

    const savingsPageHeader = document.querySelector('#savings .page-header');
    if (savingsPageHeader) {
        savingsPageHeader.style.display = canManageFinancialRecords() || role === 'member' ? '' : 'none';
    }

    const activePage = document.querySelector('.page.active')?.id;
    if (activePage && !allowedPages.includes(activePage)) {
        showPage('dashboard');
    }
}

function handleLogout(event) {
    if (event) {
        event.preventDefault();
    }
    
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('coopSession');
        window.location.href = 'login.html';
    }
}

function viewProfile(event) {
    event.preventDefault();
    alert(`User Profile\n\nName: ${currentSession.userName}\nEmail: ${currentSession.userEmail}\nRole: ${currentSession.userRole}\nLogin: ${new Date(currentSession.loginTime).toLocaleString()}`);
}

function changePassword(event) {
    event.preventDefault();
    alert('Change Password feature would be available in the full version.');
}

function viewSettings(event) {
    event.preventDefault();
    showPage('settings');
    closeUserMenu();
}

function closeUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
}

// ===== INITIALIZATION =====
function refreshCurrentView() {
    const activePage = document.querySelector('.page.active')?.id || 'dashboard';

    switch (activePage) {
        case 'members':
            loadMembers();
            break;
        case 'savings':
            loadSavings();
            break;
        case 'loans':
            loadLoans();
            break;
        case 'transactions':
            loadTransactions();
            break;
        case 'dashboard':
        default:
            loadDashboard();
            break;
    }

    updateStats();
}

function refreshAllViews() {
    loadDashboard();
    loadMembers();
    loadSavings();
    loadLoans();
    loadTransactions();
    loadMemberOptions();
    updateStats();
}

function handleStorageChange(event) {
    if (event.key === 'coopData' || event.key === 'coopSession') {
        loadData();
        updateUserInfo();
        refreshCurrentView();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Initialize session first
    if (!initializeSession()) {
        return; // Stop if not logged in
    }
    
    loadData();
    initializeEventListeners();
    window.addEventListener('storage', handleStorageChange);
    refreshCurrentView();
    initializeCharts();
    loadMemberOptions();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // User menu toggle
    const userMenuToggle = document.getElementById('userMenuToggle');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userMenuToggle && userDropdown) {
        userMenuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            userDropdown.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                userDropdown.classList.remove('active');
            }
        });
    }
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
        });
    });

    // Sidebar toggle
    document.querySelector('.toggle-sidebar').addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('active');
    });

    // Member Modal
    document.getElementById('addMemberBtn').addEventListener('click', () => {
        if (!requirePermission(canManageMembers(), 'manage members')) {
            return;
        }
        currentMemberId = null;
        document.getElementById('memberForm').reset();
        document.querySelector('#memberModal .modal-header h2').textContent = 'Add Member';
        openModal('memberModal');
    });

    document.getElementById('memberForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveMember();
    });

    document.getElementById('cancelMemberBtn').addEventListener('click', () => {
        closeModal('memberModal');
    });

    // Savings Modal
    document.getElementById('addSavingsBtn').addEventListener('click', () => {
        const role = getUserRole();
        const currentMember = getCurrentMemberRecord();

        if (role === 'member' && !currentMember) {
            alert('Your member account could not be found.');
            return;
        }

        document.getElementById('savingsForm').reset();
        document.getElementById('savingsDate').value = getTodayDateString();

        const memberSelect = document.getElementById('savingsMember');
        const typeSelect = document.getElementById('savingsType2');
        if (role === 'member' && currentMember) {
            memberSelect.value = currentMember.id;
            memberSelect.disabled = true;
            typeSelect.value = 'deposit';
            typeSelect.disabled = true;
            document.querySelector('#savingsModal .modal-header h2').textContent = 'Deposit to Your Account';
        } else {
            memberSelect.disabled = false;
            typeSelect.disabled = false;
            document.querySelector('#savingsModal .modal-header h2').textContent = 'Record Savings';
        }

        openModal('savingsModal');
    });

    document.getElementById('savingsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveSavings();
    });

    document.getElementById('cancelSavingsBtn').addEventListener('click', () => {
        closeModal('savingsModal');
    });

    // Loan Modal
    document.getElementById('approveLoanBtn').addEventListener('click', () => {
        const role = getUserRole();
        const currentMember = getCurrentMemberRecord();

        if (role === 'member') {
            if (!currentMember) {
                alert('Your member account could not be found.');
                return;
            }
        } else if (!requirePermission(canManageFinancialRecords(), 'manage loans')) {
            return;
        }

        document.getElementById('loanForm').reset();

        const memberSelect = document.getElementById('loanMember');
        if (role === 'member' && currentMember) {
            memberSelect.value = currentMember.id;
            memberSelect.disabled = true;
            document.querySelector('#loanModal .modal-header h2').textContent = 'Apply for Loan';
        } else {
            memberSelect.disabled = false;
            document.querySelector('#loanModal .modal-header h2').textContent = 'Loan Application';
        }

        openModal('loanModal');
    });

    document.getElementById('loanForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveLoan();
    });

    document.getElementById('cancelLoanBtn').addEventListener('click', () => {
        closeModal('loanModal');
    });

    // Search and Filter
    document.getElementById('memberSearch').addEventListener('input', loadMembers);
    document.getElementById('memberStatus').addEventListener('change', loadMembers);
    document.getElementById('savingsSearch').addEventListener('input', loadSavings);
    document.getElementById('savingsType').addEventListener('change', loadSavings);
    document.getElementById('loansSearch').addEventListener('input', loadLoans);
    document.getElementById('loansStatus').addEventListener('change', loadLoans);
    document.getElementById('transSearch').addEventListener('input', loadTransactions);
    document.getElementById('transType').addEventListener('change', loadTransactions);
    document.getElementById('transDate').addEventListener('change', loadTransactions);

    // Reports
    document.getElementById('monthlyReportBtn').addEventListener('click', generateMonthlyReport);
    document.getElementById('memberReportBtn').addEventListener('click', generateMemberReport);
    document.getElementById('loanReportBtn').addEventListener('click', generateLoanReport);
    document.getElementById('financialReportBtn').addEventListener('click', generateFinancialReport);

    // Export
    document.getElementById('exportTransactionsBtn').addEventListener('click', exportTransactions);

    // Settings
    document.getElementById('settingsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveSettings();
    });

    document.getElementById('systemSettings').addEventListener('submit', (e) => {
        e.preventDefault();
        saveSystemSettings();
    });

    // Modal Close Buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal.id);
        });
    });

    // Close modal on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

// ===== PAGE NAVIGATION =====
function showPage(pageName) {
    const role = getUserRole();
    const allowedPages = role === 'admin'
        ? ['dashboard', 'members', 'savings', 'loans', 'transactions', 'reports', 'settings']
        : role === 'officer'
            ? ['dashboard', 'members', 'savings', 'loans', 'transactions', 'reports']
            : ['dashboard', 'members', 'savings', 'loans', 'transactions'];

    if (!allowedPages.includes(pageName)) {
        pageName = 'dashboard';
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    document.getElementById(pageName).classList.add('active');

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });

    // Load page-specific content
    switch (pageName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'members':
            loadMembers();
            break;
        case 'savings':
            loadSavings();
            break;
        case 'loans':
            loadLoans();
            break;
        case 'transactions':
            loadTransactions();
            break;
    }

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.remove('active');
    }
}

// ===== DASHBOARD =====
function loadDashboard() {
    updateStats();
    updateCharts();
}

function updateStats() {
    const role = getUserRole();
    const currentMember = getCurrentMemberRecord();

    if (role === 'member' && currentMember) {
        const memberSavings = appData.savings
            .filter(s => s.memberId === currentMember.id)
            .reduce((sum, s) => sum + (s.type === 'deposit' ? s.amount : -s.amount), 0);
        const memberLoans = appData.loans
            .filter(l => l.memberId === currentMember.id && l.status !== 'paid')
            .reduce((sum, l) => sum + l.amount, 0);
        const memberTransactions = appData.transactions.filter(t => t.memberId === currentMember.id).length;

        document.getElementById('statLabelMembers').textContent = 'My Savings';
        document.getElementById('statLabelSavings').textContent = 'My Loans';
        document.getElementById('statLabelLoans').textContent = 'My Transactions';
        document.getElementById('statLabelTransactions').textContent = 'Account Status';

        document.getElementById('totalMembers').textContent = `Shs ${memberSavings.toFixed(2)}`;
        document.getElementById('totalSavings').textContent = `Shs ${memberLoans.toFixed(2)}`;
        document.getElementById('totalLoans').textContent = memberTransactions;
        document.getElementById('recentTransactions').textContent = currentMember.status.toUpperCase();
    } else {
        const totalMembers = appData.members.length;
        const totalSavings = appData.savings.reduce((sum, s) => {
            return sum + (s.type === 'deposit' ? s.amount : -s.amount);
        }, 0);
        const totalLoans = appData.loans.reduce((sum, l) => {
            if (l.status !== 'paid') {
                return sum + l.amount;
            }
            return sum;
        }, 0);
        const recentTransactions = appData.transactions.length;

        const labels = role === 'officer'
            ? ['Pending Reviews', 'Daily Savings', 'Loan Applications', 'Transactions']
            : ['Total Members', 'Total Savings', 'Outstanding Loans', 'Recent Transactions'];

        document.getElementById('statLabelMembers').textContent = labels[0];
        document.getElementById('statLabelSavings').textContent = labels[1];
        document.getElementById('statLabelLoans').textContent = labels[2];
        document.getElementById('statLabelTransactions').textContent = labels[3];

        document.getElementById('totalMembers').textContent = role === 'officer' ? appData.loans.filter(l => l.status === 'pending').length : totalMembers;
        document.getElementById('totalSavings').textContent = `Shs ${totalSavings.toFixed(2)}`;
        document.getElementById('totalLoans').textContent = role === 'officer' ? appData.loans.filter(l => l.status === 'approved' || l.status === 'pending').length : `Shs ${totalLoans.toFixed(2)}`;
        document.getElementById('recentTransactions').textContent = recentTransactions;
    }

    renderRoleDashboard();
}

function renderRoleDashboard() {
    const role = getUserRole();
    const title = document.getElementById('roleDashboardTitle');
    const content = document.getElementById('roleDashboardContent');
    const charts = document.getElementById('dashboardCharts');

    if (!title || !content) {
        return;
    }

    if (role === 'admin') {
        title.textContent = 'Admin Overview';
        content.innerHTML = `
            <p>Manage members, monitor finances, and oversee cooperative operations.</p>
            <ul>
                <li>Add or update member profiles</li>
                <li>Review savings and loan activity</li>
                <li>Adjust system settings and reports</li>
            </ul>
        `;
        if (charts) {
            charts.style.display = '';
        }
    } else if (role === 'officer') {
        title.textContent = 'Officer Overview';
        content.innerHTML = `
            <p>Focus on daily financial work and member support tasks.</p>
            <ul>
                <li>Record savings transactions</li>
                <li>Process loan applications</li>
                <li>Review member activity and reports</li>
            </ul>
        `;
        if (charts) {
            charts.style.display = '';
        }
    } else {
        title.textContent = 'Member Overview';
        content.innerHTML = `
            <p>Track your account activity and stay informed about your savings and loans.</p>
            <ul>
                <li>View personal savings balance</li>
                <li>Review your recent transactions</li>
                <li>See loan updates and account status</li>
            </ul>
        `;
        if (charts) {
            charts.style.display = 'none';
        }
    }
}

function initializeCharts() {
    const memberCtx = document.getElementById('memberChart');
    const savingsCtx = document.getElementById('savingsChart');

    if (memberCtx) {
        if (memberChartInstance) {
            memberChartInstance.destroy();
        }
        memberChartInstance = new Chart(memberCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Members',
                    data: [5, 8, 12, 15, 20, appData.members.length],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    if (savingsCtx) {
        if (savingsChartInstance) {
            savingsChartInstance.destroy();
        }

        const totalSavings = appData.savings.reduce((sum, s) => {
            return sum + (s.type === 'deposit' ? s.amount : -s.amount);
        }, 0);

        const totalLoans = appData.loans.reduce((sum, l) => {
            if (l.status !== 'paid') {
                return sum + l.amount;
            }
            return sum;
        }, 0);

        savingsChartInstance = new Chart(savingsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Total Savings', 'Outstanding Loans'],
                datasets: [{
                    data: [totalSavings, totalLoans],
                    backgroundColor: ['#10b981', '#f59e0b'],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

function updateCharts() {
    initializeCharts();
}

// ===== MEMBERS =====
function loadMembers() {
    const searchText = document.getElementById('memberSearch').value.toLowerCase();
    const statusFilter = document.getElementById('memberStatus').value;

    let filteredMembers = appData.members.filter(member => {
        const matchSearch = member.name.toLowerCase().includes(searchText) ||
            member.email.toLowerCase().includes(searchText) ||
            member.phone.includes(searchText);
        const matchStatus = statusFilter === '' || member.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const tbody = document.getElementById('membersTableBody');
    tbody.innerHTML = '';

    if (filteredMembers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px;">No members found</td></tr>';
        return;
    }

    filteredMembers.forEach(member => {
        const memberSavings = appData.savings
            .filter(s => s.memberId === member.id)
            .reduce((sum, s) => sum + (s.type === 'deposit' ? s.amount : -s.amount), 0);

        const row = document.createElement('tr');
        const balanceDisplay = canViewMemberFinancialDetails()
            ? `Shs ${memberSavings.toFixed(2)}`
            : '<span class="status-badge status-active">Private</span>';

        row.innerHTML = `
            <td>${member.id}</td>
            <td>
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span>${member.name}</span>
                    <span class="status-badge status-self-deposit" title="Can deposit without treasurer/admin approval">
                        <i class="fas fa-wallet"></i>
                    </span>
                    <span class="status-badge status-member-view" title="Can view all members in the sacco">
                        <i class="fas fa-users"></i>
                    </span>
                </div>
            </td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
            <td>${balanceDisplay}</td>
            <td><span class="status-badge status-${member.status}">${member.status}</span></td>
            <td>
                <div class="table-actions">
                    ${canManageMembers() ? `<button class="btn btn-secondary" onclick="editMember('${member.id}')">Edit</button>` : ''}
                    ${canManageMembers() ? `<button class="btn btn-danger" onclick="deleteMember('${member.id}')">Delete</button>` : '<span class="status-badge status-active">View only</span>'}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    loadMemberOptions();
}

function saveMember() {
    if (!requirePermission(canManageMembers(), 'manage members')) {
        return;
    }

    const name = document.getElementById('memberName').value;
    const email = document.getElementById('memberEmail').value;
    const phone = document.getElementById('memberPhone').value;
    const address = document.getElementById('memberAddress').value;
    const occupation = document.getElementById('memberOccupation').value;

    if (currentMemberId) {
        const member = appData.members.find(m => m.id === currentMemberId);
        if (member) {
            member.name = name;
            member.email = email;
            member.phone = phone;
            member.address = address;
            member.occupation = occupation;
        }
    } else {
        const newMember = {
            id: 'M' + Date.now(),
            name,
            email,
            phone,
            address,
            occupation,
            status: 'active',
            joinDate: getTodayDateString()
        };
        appData.members.push(newMember);
    }

    saveData();
    closeModal('memberModal');
    loadMembers();
    updateStats();
    loadDashboard();
}

function editMember(memberId) {
    const member = appData.members.find(m => m.id === memberId);
    if (member) {
        currentMemberId = memberId;
        document.getElementById('memberName').value = member.name;
        document.getElementById('memberEmail').value = member.email;
        document.getElementById('memberPhone').value = member.phone;
        document.getElementById('memberAddress').value = member.address;
        document.getElementById('memberOccupation').value = member.occupation;
        document.querySelector('#memberModal .modal-header h2').textContent = 'Edit Member';
        openModal('memberModal');
    }
}

function deleteMember(memberId) {
    if (!requirePermission(canManageMembers(), 'manage members')) {
        return;
    }

    if (confirm('Are you sure you want to delete this member?')) {
        appData.members = appData.members.filter(m => m.id !== memberId);
        saveData();
        loadMembers();
        updateStats();
    }
}

function loadMemberOptions() {
    const selects = ['savingsMember', 'loanMember'];
    const role = getUserRole();
    const currentMember = getCurrentMemberRecord();
    const eligibleMembers = role === 'member' && currentMember && !canViewAllAccounts()
        ? appData.members.filter(member => member.id === currentMember.id)
        : appData.members;

    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) {
            return;
        }
        const currentValue = select.value;
        select.innerHTML = '<option value="">Select Member</option>';
        eligibleMembers.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = member.name;
            select.appendChild(option);
        });
        select.value = currentValue || (role === 'member' && currentMember ? currentMember.id : '');
    });
}

// ===== SAVINGS =====
function loadSavings() {
    const searchText = document.getElementById('savingsSearch').value.toLowerCase();
    const typeFilter = document.getElementById('savingsType').value;
    const role = getUserRole();
    const currentMember = getCurrentMemberRecord();

    let filteredSavings = appData.savings.filter(saving => {
        const member = appData.members.find(m => m.id === saving.memberId);
        const matchOwner = canViewAllAccounts() || !currentMember || saving.memberId === currentMember.id;
        const matchSearch = member && member.name.toLowerCase().includes(searchText);
        const matchType = typeFilter === '' || saving.type === typeFilter;
        return matchOwner && matchSearch && matchType;
    });

    filteredSavings.sort((a, b) => new Date(a.date) - new Date(b.date));

    const tbody = document.getElementById('savingsTableBody');
    tbody.innerHTML = '';

    if (filteredSavings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px;">No savings found</td></tr>';
        return;
    }

    const runningBalances = {};
    const sortedSavings = [...appData.savings].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedSavings.forEach(s => {
        if (!runningBalances[s.memberId]) {
            runningBalances[s.memberId] = 0;
        }
        runningBalances[s.memberId] += s.type === 'deposit' ? s.amount : -s.amount;
    });

    filteredSavings.forEach(saving => {
        const member = appData.members.find(m => m.id === saving.memberId);
        const balance = runningBalances[saving.memberId] || 0;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${saving.date}</td>
            <td>${member ? member.name : 'Unknown'}</td>
            <td><span class="status-badge status-${saving.type}">${saving.type}</span></td>
            <td>Shs ${saving.amount.toFixed(2)}</td>
            <td>Shs ${balance.toFixed(2)}</td>
            <td><span class="status-badge status-${saving.status}">${saving.status}</span></td>
            <td>
                <div class="table-actions">
                    ${canManageFinancialRecords() ? `<button class="btn btn-danger" onclick="deleteSavings('${saving.id}')">Delete</button>` : '<span class="status-badge status-active">View only</span>'}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function saveSavings() {
    const role = getUserRole();
    const currentMember = getCurrentMemberRecord();
    const type = document.getElementById('savingsType2').value;
    const amount = parseFloat(document.getElementById('savingsAmount').value);
    const date = document.getElementById('savingsDate').value || getTodayDateString();
    const description = document.getElementById('savingsDescription').value;

    if (role === 'member') {
        if (!currentMember) {
            alert('Your member account could not be found.');
            return;
        }
        if (type !== 'deposit') {
            alert('Members can only deposit money to their own account. Withdrawals require treasurer/admin approval.');
            return;
        }
    } else if (!requirePermission(canManageFinancialRecords(), 'record savings')) {
        return;
    }

    const memberId = role === 'member' && currentMember ? currentMember.id : document.getElementById('savingsMember').value;

    if (!memberId) {
        alert('Please select a member');
        return;
    }

    const newSaving = {
        id: 'S' + Date.now(),
        memberId,
        type,
        amount,
        date,
        description,
        status: 'completed'
    };

    appData.savings.push(newSaving);

    const transaction = {
        id: 'T' + Date.now(),
        date,
        memberId,
        type: type === 'deposit' ? 'deposit' : 'withdrawal',
        amount,
        reference: newSaving.id,
        status: 'completed'
    };
    appData.transactions.push(transaction);

    saveData();
    loadData();
    closeModal('savingsModal');
    refreshAllViews();
}

function deleteSavings(savingId) {
    if (!requirePermission(canManageFinancialRecords(), 'delete savings records')) {
        return;
    }

    if (confirm('Are you sure you want to delete this savings record?')) {
        appData.savings = appData.savings.filter(s => s.id !== savingId);
        appData.transactions = appData.transactions.filter(t => t.reference !== savingId);
        saveData();
        refreshCurrentView();
    }
}

// ===== LOANS =====
function loadLoans() {
    const searchText = document.getElementById('loansSearch').value.toLowerCase();
    const statusFilter = document.getElementById('loansStatus').value;

    let filteredLoans = appData.loans.filter(loan => {
        const member = appData.members.find(m => m.id === loan.memberId);
        const matchSearch = member && member.name.toLowerCase().includes(searchText);
        const matchStatus = statusFilter === '' || loan.status === statusFilter;
        return matchSearch && matchStatus;
    });

    filteredLoans.sort((a, b) => new Date(b.date) - new Date(a.date));

    const tbody = document.getElementById('loansTableBody');
    tbody.innerHTML = '';

    if (filteredLoans.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px;">No loans found</td></tr>';
        return;
    }

    filteredLoans.forEach(loan => {
        const member = appData.members.find(m => m.id === loan.memberId);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${loan.id}</td>
            <td>${member ? member.name : 'Unknown'}</td>
            <td>Shs ${loan.amount.toFixed(2)}</td>
            <td>${loan.rate}%</td>
            <td>${loan.tenor} months</td>
            <td><span class="status-badge status-${loan.status}">${loan.status}</span></td>
            <td>
                <div class="table-actions">
                    ${canManageFinancialRecords() && loan.status === 'pending' ? `<button class="btn btn-success" onclick="approveLoan('${loan.id}')">Approve</button>` : ''}
                    ${canManageFinancialRecords() && loan.status === 'approved' ? `<button class="btn btn-success" onclick="disburseLoan('${loan.id}')">Disburse</button>` : ''}
                    ${canManageFinancialRecords() ? `<button class="btn btn-danger" onclick="deleteLoan('${loan.id}')">Delete</button>` : '<span class="status-badge status-active">View only</span>'}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function saveLoan() {
    const role = getUserRole();
    const currentMember = getCurrentMemberRecord();

    if (role === 'member') {
        if (!currentMember) {
            alert('Your member account could not be found.');
            return;
        }
    } else if (!requirePermission(canManageFinancialRecords(), 'manage loans')) {
        return;
    }

    const memberId = role === 'member' && currentMember ? currentMember.id : document.getElementById('loanMember').value;
    const amount = parseFloat(document.getElementById('loanAmount').value);
    const rate = parseFloat(document.getElementById('loanRate').value);
    const tenor = parseInt(document.getElementById('loanTenor').value);
    const purpose = document.getElementById('loanPurpose').value;

    if (!memberId) {
        alert('Please select a member');
        return;
    }

    const newLoan = {
        id: 'L' + Date.now(),
        memberId,
        amount,
        rate,
        tenor,
        purpose,
        date: getTodayDateString(),
        status: 'pending'
    };

    appData.loans.push(newLoan);
    saveData();
    closeModal('loanModal');
    refreshCurrentView();
}

function approveLoan(loanId) {
    if (!requirePermission(canManageFinancialRecords(), 'approve loans')) {
        return;
    }

    const loan = appData.loans.find(l => l.id === loanId);
    if (loan) {
        loan.status = 'approved';
        saveData();
        refreshCurrentView();
    }
}

function disburseLoan(loanId) {
    if (!requirePermission(canManageFinancialRecords(), 'disburse loans')) {
        return;
    }

    const loan = appData.loans.find(l => l.id === loanId);
    if (loan) {
        loan.status = 'disbursed';
        
        // Create transaction for loan disbursement
        const transaction = {
            id: 'T' + Date.now(),
            date: getTodayDateString(),
            memberId: loan.memberId,
            type: 'loan',
            amount: loan.amount,
            reference: loan.id,
            status: 'completed'
        };
        appData.transactions.push(transaction);
        
        saveData();
        refreshCurrentView();
    }
}

function deleteLoan(loanId) {
    if (!requirePermission(canManageFinancialRecords(), 'delete loans')) {
        return;
    }

    if (confirm('Are you sure you want to delete this loan?')) {
        appData.loans = appData.loans.filter(l => l.id !== loanId);
        appData.transactions = appData.transactions.filter(t => t.reference !== loanId);
        saveData();
        refreshCurrentView();
    }
}

// ===== TRANSACTIONS =====
function loadTransactions() {
    const searchText = document.getElementById('transSearch').value.toLowerCase();
    const typeFilter = document.getElementById('transType').value;
    const dateFilter = document.getElementById('transDate').value;

    let filteredTransactions = getVisibleTransactions().filter(trans => {
        const member = appData.members.find(m => m.id === trans.memberId);
        const matchSearch = trans.id.toLowerCase().includes(searchText) ||
            (member && member.name.toLowerCase().includes(searchText));
        const matchType = typeFilter === '' || trans.type === typeFilter;
        const matchDate = dateFilter === '' || trans.date === dateFilter;
        return matchSearch && matchType && matchDate;
    });

    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    const tbody = document.getElementById('transactionsTableBody');
    tbody.innerHTML = '';

    if (filteredTransactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px;">No transactions found</td></tr>';
        return;
    }

    filteredTransactions.forEach(trans => {
        const member = appData.members.find(m => m.id === trans.memberId);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${trans.id}</td>
            <td>${trans.date}</td>
            <td>${member ? member.name : 'Unknown'}</td>
            <td>${trans.type}</td>
            <td>Shs ${trans.amount.toFixed(2)}</td>
            <td>${trans.reference}</td>
            <td><span class="status-badge status-${trans.status}">${trans.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// ===== REPORTS =====
function generateMonthlyReport() {
    const rows = appData.transactions.map(trans => {
        const member = appData.members.find(m => m.id === trans.memberId);
        return `<tr><td>${trans.date}</td><td>${member?.name || 'Unknown'}</td><td>${trans.type}</td><td>${trans.amount.toFixed(2)}</td></tr>`;
    }).join('');

    const content = `
        <html>
            <head><title>Monthly Report</title></head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>The Bridge Micro Saving</h2>
                <h3>Monthly Report</h3>
                <p>Generated: ${getTodayDateString()}</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr><th style="border: 1px solid #ccc; padding: 6px;">Date</th><th style="border: 1px solid #ccc; padding: 6px;">Member</th><th style="border: 1px solid #ccc; padding: 6px;">Type</th><th style="border: 1px solid #ccc; padding: 6px;">Amount</th></tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="4">No transactions available</td></tr>'}</tbody>
                </table>
            </body>
        </html>
    `;
    printReport(content, 'monthly-report.pdf');
}

function generateMemberReport() {
    const rows = appData.members.map(member => {
        const savings = appData.savings.filter(s => s.memberId === member.id).reduce((sum, s) => sum + (s.type === 'deposit' ? s.amount : -s.amount), 0);
        return `<tr><td>${member.id}</td><td>${member.name}</td><td>${member.email}</td><td>${member.phone}</td><td>${savings.toFixed(2)}</td></tr>`;
    }).join('');

    const content = `
        <html>
            <head><title>Member Report</title></head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>The Bridge Micro Saving</h2>
                <h3>Member Report</h3>
                <p>Generated: ${getTodayDateString()}</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr><th style="border: 1px solid #ccc; padding: 6px;">ID</th><th style="border: 1px solid #ccc; padding: 6px;">Name</th><th style="border: 1px solid #ccc; padding: 6px;">Email</th><th style="border: 1px solid #ccc; padding: 6px;">Phone</th><th style="border: 1px solid #ccc; padding: 6px;">Savings</th></tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="5">No members available</td></tr>'}</tbody>
                </table>
            </body>
        </html>
    `;
    printReport(content, 'member-report.pdf');
}

function generateLoanReport() {
    const rows = appData.loans.map(loan => {
        const member = appData.members.find(m => m.id === loan.memberId);
        return `<tr><td>${loan.id}</td><td>${member?.name || 'Unknown'}</td><td>${loan.amount.toFixed(2)}</td><td>${loan.rate}</td><td>${loan.tenor}</td><td>${loan.status}</td></tr>`;
    }).join('');

    const content = `
        <html>
            <head><title>Loan Report</title></head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>The Bridge Micro Saving</h2>
                <h3>Loan Report</h3>
                <p>Generated: ${getTodayDateString()}</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr><th style="border: 1px solid #ccc; padding: 6px;">ID</th><th style="border: 1px solid #ccc; padding: 6px;">Member</th><th style="border: 1px solid #ccc; padding: 6px;">Amount</th><th style="border: 1px solid #ccc; padding: 6px;">Rate</th><th style="border: 1px solid #ccc; padding: 6px;">Tenor</th><th style="border: 1px solid #ccc; padding: 6px;">Status</th></tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="6">No loans available</td></tr>'}</tbody>
                </table>
            </body>
        </html>
    `;
    printReport(content, 'loan-report.pdf');
}

function generateFinancialReport() {
    const totalSavings = appData.savings.reduce((sum, s) => sum + (s.type === 'deposit' ? s.amount : -s.amount), 0);
    const outstandingLoans = appData.loans.reduce((sum, l) => l.status !== 'paid' ? sum + l.amount : sum, 0);
    const content = `
        <html>
            <head><title>Financial Summary Report</title></head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>The Bridge Micro Saving</h2>
                <h3>Financial Summary Report</h3>
                <p>Generated: ${getTodayDateString()}</p>
                <p><strong>Total Savings:</strong> ${totalSavings.toFixed(2)}</p>
                <p><strong>Outstanding Loans:</strong> ${outstandingLoans.toFixed(2)}</p>
                <p><strong>Members:</strong> ${appData.members.length}</p>
                <p><strong>Transactions:</strong> ${appData.transactions.length}</p>
            </body>
        </html>
    `;
    printReport(content, 'financial-report.pdf');
}

function printReport(content, filename) {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
        alert('Please allow pop-ups to download the PDF report.');
        return;
    }

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    alert(`PDF report ready. Use the browser print dialog to save as ${filename}.`);
}

function exportTransactions() {
    let csvContent = 'Trans ID,Date,Member,Type,Amount,Reference,Status\n';

    getVisibleTransactions().forEach(trans => {
        const member = appData.members.find(m => m.id === trans.memberId);
        csvContent += `${trans.id},${trans.date},${member?.name || 'Unknown'},${trans.type},${trans.amount},${trans.reference},${trans.status}\n`;
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', 'transactions.csv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// ===== SETTINGS =====
function saveSettings() {
    if (!requirePermission(canAccessSettings(), 'change settings')) {
        return;
    }

    appData.settings.orgName = document.getElementById('orgName').value;
    appData.settings.orgEmail = document.getElementById('orgEmail').value;
    appData.settings.orgPhone = document.getElementById('orgPhone').value;
    appData.settings.orgAddress = document.getElementById('orgAddress').value;
    saveData();
    document.getElementById('userWelcome').textContent = `Welcome, ${currentSession.userName}`;
    document.querySelector('header h1').textContent = appData.settings.orgName;
    alert('Organization settings saved successfully!');
}

function saveSystemSettings() {
    if (!requirePermission(canAccessSettings(), 'change system settings')) {
        return;
    }

    appData.settings.defaultRate = parseFloat(document.getElementById('defaultRate').value);
    appData.settings.minLoan = parseFloat(document.getElementById('minLoan').value);
    appData.settings.maxLoan = parseFloat(document.getElementById('maxLoan').value);
    saveData();
    alert('System settings saved successfully!');
}

// ===== MODAL FUNCTIONS =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// ===== DATA PERSISTENCE =====
function saveData() {
    localStorage.setItem('coopData', JSON.stringify(appData));
}

function loadData() {
    const savedData = localStorage.getItem('coopData');
    if (savedData) {
        appData = JSON.parse(savedData);
    }

    ensureRequiredMembers();
    
    // Update settings form
    if (appData.settings) {
        document.getElementById('orgName').value = appData.settings.orgName;
        document.getElementById('orgEmail').value = appData.settings.orgEmail;
        document.getElementById('orgPhone').value = appData.settings.orgPhone;
        document.getElementById('orgAddress').value = appData.settings.orgAddress;
        document.getElementById('defaultRate').value = appData.settings.defaultRate;
        document.getElementById('minLoan').value = appData.settings.minLoan;
        document.getElementById('maxLoan').value = appData.settings.maxLoan;
    }
}

// ===== UTILITY FUNCTIONS =====
function formatCurrency(value) {
    return `Shs ${Number(value).toLocaleString('en-UG')}`;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

// Handle window resize for responsive behavior
window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
        document.querySelector('.sidebar').classList.remove('active');
    }
});

// Add sample data for demonstration
function addSampleData() {
    if (appData.members.length === 0) {
        appData.members = [];

        appData.savings = [
            {
                id: 'S001',
                memberId: 'M001',
                type: 'deposit',
                amount: 500,
                date: getTodayDateString(),
                description: 'Monthly savings',
                status: 'completed'
            },
            {
                id: 'S002',
                memberId: 'M002',
                type: 'deposit',
                amount: 300,
                date: getTodayDateString(),
                description: 'Monthly savings',
                status: 'completed'
            }
        ];

        appData.loans = [
            {
                id: 'L001',
                memberId: 'M001',
                amount: 2000,
                rate: 10,
                tenor: 12,
                purpose: 'Business expansion',
                date: getTodayDateString(),
                status: 'approved'
            }
        ];

        appData.transactions = [
            {
                id: 'T001',
                date: getTodayDateString(),
                memberId: 'M001',
                type: 'deposit',
                amount: 500,
                reference: 'S001',
                status: 'completed'
            },
            {
                id: 'T002',
                date: getTodayDateString(),
                memberId: 'M002',
                type: 'deposit',
                amount: 300,
                reference: 'S002',
                status: 'completed'
            }
        ];

        saveData();
    }

    ensureRequiredMembers();
}

// Load sample data on first run
addSampleData();
