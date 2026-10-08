// ==========================================
// 1. GLOBAL STATE & LOCAL STORAGE SEED DATA
// ==========================================

const SEED_JOBS = [
  {
    id: 101,
    title: "Senior Full Stack Engineer",
    company: "Apex Tech Labs",
    location: "Bengaluru, Karnataka",
    category: "Engineering",
    type: "Full-time",
    salary: "₹28 - 40 LPA",
    description: "Lead our core product team using React, Node.js and PostgreSQL. Experience building scalable systems for Indian consumer apps (UPI, KYC, regional-language support) is a plus."
  },
  {
    id: 102,
    title: "Product Designer (UI/UX)",
    company: "CreativeFlow",
    location: "Remote (India)",
    category: "Design",
    type: "Remote",
    salary: "₹14 - 22 LPA",
    description: "Design intuitive web and mobile interfaces for users across tier-1 to tier-3 cities. High proficiency in Figma and design systems required."
  },
  {
    id: 103,
    title: "Growth Marketing Manager",
    company: "Vanguard Media",
    location: "Mumbai, Maharashtra",
    category: "Marketing",
    type: "Contract",
    salary: "₹10 - 16 LPA",
    description: "Drive multi-channel user acquisition campaigns, SEO optimization and lifecycle marketing across Google, Meta and WhatsApp channels."
  },
  {
    id: 104,
    title: "Data Analyst",
    company: "FinTrack India",
    location: "Hyderabad, Telangana",
    category: "Data & AI",
    type: "Full-time",
    salary: "₹8 - 14 LPA",
    description: "Analyse lending and payments data using SQL, Python and Power BI. Build dashboards for business teams and track key product metrics."
  },
  {
    id: 105,
    title: "Software Engineering Intern",
    company: "Nexora Systems",
    location: "Bengaluru, Karnataka",
    category: "Engineering",
    type: "Internship",
    salary: "₹25,000 - 40,000 / month",
    description: "6-month paid internship for B.E./B.Tech students (2027/2028/2029 batch). Work with mentors on real features using JavaScript, Java or Python. PPO opportunity based on performance."
  },
  {
    id: 106,
    title: "Machine Learning Engineer",
    company: "NeuralNest AI",
    location: "Bengaluru, Karnataka",
    category: "Data & AI",
    type: "Full-time",
    salary: "₹20 - 35 LPA",
    description: "Build and deploy ML models for speech and text in Indian languages (Hindi, Tamil, Telugu, Kannada). Strong Python, PyTorch and MLOps fundamentals required."
  },
  {
    id: 107,
    title: "Associate Product Manager",
    company: "KiranaKart",
    location: "Gurugram, Haryana",
    category: "Product",
    type: "Full-time",
    salary: "₹18 - 26 LPA",
    description: "Own features for our B2B commerce app serving neighbourhood kirana stores. Work with engineering, design and field-ops teams to ship fast and measure impact."
  },
  {
    id: 108,
    title: "Vernacular Content & Social Media Executive",
    company: "BharatReach",
    location: "Remote (India)",
    category: "Marketing",
    type: "Remote",
    salary: "₹4 - 7 LPA",
    description: "Create engaging short-form content in Hindi plus one more regional language (Tamil, Telugu, Marathi or Bengali) for Instagram, YouTube Shorts and ShareChat."
  },
  {
    id: 109,
    title: "Embedded / IoT Engineer",
    company: "SmartGrid Innovations",
    location: "Pune, Maharashtra",
    category: "Engineering",
    type: "Full-time",
    salary: "₹10 - 18 LPA",
    description: "Develop firmware for ESP32/STM32-based smart metering and monitoring devices. Knowledge of C/C++, MQTT, sensors and PCB basics expected."
  },
  {
    id: 110,
    title: "Cloud & DevOps Engineer",
    company: "CloudKosh Technologies",
    location: "Chennai, Tamil Nadu",
    category: "Engineering",
    type: "Full-time",
    salary: "₹12 - 20 LPA",
    description: "Manage CI/CD pipelines, Docker and Kubernetes clusters on AWS/Azure. Experience with Terraform and monitoring tools like Grafana is preferred."
  },
  {
    id: 111,
    title: "UI/UX Design Intern",
    company: "DesignDhaba",
    location: "Remote (India)",
    category: "Design",
    type: "Internship",
    salary: "₹15,000 - 25,000 / month",
    description: "3-month remote internship for students. Create wireframes and prototypes in Figma for Indian startups, with mentorship from senior designers."
  },
  {
    id: 112,
    title: "Cybersecurity Analyst",
    company: "SecureNet India",
    location: "Hyderabad, Telangana",
    category: "Engineering",
    type: "Full-time",
    salary: "₹9 - 16 LPA",
    description: "Monitor security events in our SOC, run vulnerability assessments and help meet RBI and CERT-In compliance requirements. Knowledge of networking and SIEM tools needed."
  }
];

let currentUser = null; // set after login (see section 7)

// Bump this number whenever SEED_JOBS changes. Old cached jobs (e.g. the $ ones)
// are replaced automatically; saved jobs and applications are kept.
const SEED_VERSION = '2';
if (localStorage.getItem('hp_seedVersion') !== SEED_VERSION) {
  localStorage.removeItem('hp_jobs');
  localStorage.setItem('hp_seedVersion', SEED_VERSION);
}

// Load application state from localStorage or initialize defaults
let appState = {
  activeRole: 'seeker', // 'seeker' | 'employer'
  activeSeekerTab: 'all', // 'all' | 'saved' | 'applied'
  savedJobIds: [], // loaded per user after login
  jobs: JSON.parse(localStorage.getItem('hp_jobs')) || SEED_JOBS,
  applications: JSON.parse(localStorage.getItem('hp_applications')) || []
};

// Initialize persistent storage if empty
function syncStorage() {
  localStorage.setItem('hp_seedVersion', SEED_VERSION);
  localStorage.setItem('hp_jobs', JSON.stringify(appState.jobs));
  if (currentUser) localStorage.setItem('hp_savedJobs_' + currentUser.id, JSON.stringify(appState.savedJobIds));
  localStorage.setItem('hp_applications', JSON.stringify(appState.applications));
}

// ==========================================
// 2. CORE RENDERING ENGINE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('hp_jobs')) {
    syncStorage();
  }
  restoreSession();
});

function render() {
  if (appState.activeRole === 'seeker') {
    document.getElementById('seekerSection').classList.remove('hidden');
    document.getElementById('employerSection').classList.add('hidden');
    renderSeekerGrid();
  } else {
    document.getElementById('seekerSection').classList.add('hidden');
    document.getElementById('employerSection').classList.remove('hidden');
    renderEmployerDashboard();
  }
  updateCounters();
}

// ==========================================
// 3. JOB SEEKER MODULE & FILTER ENGINE
// ==========================================

function handleSearchAndFilter() {
  renderSeekerGrid();
}

function switchSeekerTab(tabName) {
  appState.activeSeekerTab = tabName;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  
  if (tabName === 'all') document.getElementById('tabAllJobs').classList.add('active');
  if (tabName === 'saved') document.getElementById('tabSavedJobs').classList.add('active');
  if (tabName === 'applied') document.getElementById('tabMyApps').classList.add('active');

  renderSeekerGrid();
}

function renderSeekerGrid() {
  const container = document.getElementById('jobGrid');
  const searchVal = document.getElementById('searchInput').value.toLowerCase().trim();
  const categoryVal = document.getElementById('categoryFilter').value;
  const typeVal = document.getElementById('typeFilter').value;

  // Filter pipeline
  let filtered = appState.jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchVal) || 
                          job.company.toLowerCase().includes(searchVal) ||
                          (job.location || '').toLowerCase().includes(searchVal) ||
                          job.description.toLowerCase().includes(searchVal);
    const matchesCategory = categoryVal === 'all' || job.category === categoryVal;
    const matchesType = typeVal === 'all' || job.type === typeVal;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Filter based on active tab
  if (appState.activeSeekerTab === 'saved') {
    filtered = filtered.filter(j => appState.savedJobIds.includes(j.id));
  } else if (appState.activeSeekerTab === 'applied') {
    const appliedJobIds = myApplications().map(a => a.jobId);
    filtered = filtered.filter(j => appliedJobIds.includes(j.id));
  }

  document.getElementById('jobCountBadge').innerText = `Showing ${filtered.length} of ${appState.jobs.length} jobs`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
        <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; margin-bottom: 10px;"></i>
        <p>No jobs found matching your criteria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(job => {
    const isSaved = appState.savedJobIds.includes(job.id);
    const hasApplied = myApplications().some(a => a.jobId === job.id);

    return `
      <div class="job-card">
        <div>
          <div class="job-card-header">
            <h3>${escapeHTML(job.title)}</h3>
            <button class="bookmark-btn ${isSaved ? 'active' : ''}" onclick="toggleBookmark(${job.id})" title="Save Job">
              <i class="fa-${isSaved ? 'solid' : 'regular'} fa-bookmark"></i>
            </button>
          </div>
          <div class="company-name">${escapeHTML(job.company)}</div>
          ${job.location ? `<div class="job-location"><i class="fa-solid fa-location-dot"></i> ${escapeHTML(job.location)}</div>` : ''}
          <div class="badges-row">
            <span class="badge badge-blue">${escapeHTML(job.category)}</span>
            <span class="badge badge-green">${escapeHTML(job.type)}</span>
          </div>
          <p class="job-desc">${escapeHTML(job.description)}</p>
        </div>
        <div class="card-footer">
          <span class="salary-tag">${escapeHTML(job.salary)}</span>
          ${hasApplied ? 
            `<span class="badge badge-purple"><i class="fa-solid fa-check"></i> Applied</span>` : 
            `<button class="btn btn-primary btn-sm" onclick="openApplyModal(${job.id})">Apply Now</button>`
          }
        </div>
      </div>
    `;
  }).join('');
}

function toggleBookmark(jobId) {
  if (appState.savedJobIds.includes(jobId)) {
    appState.savedJobIds = appState.savedJobIds.filter(id => id !== jobId);
    showToast("Job removed from bookmarks");
  } else {
    appState.savedJobIds.push(jobId);
    showToast("Job saved to bookmarks!");
  }
  syncStorage();
  render();
}

// ==========================================
// 4. APPLICATION & BASE64 FILE HANDLING
// ==========================================

function openApplyModal(jobId) {
  const job = appState.jobs.find(j => j.id === jobId);
  if (!job) return;

  document.getElementById('applyJobId').value = jobId;
  document.getElementById('applyModalTitle').innerText = `Apply for ${job.title} at ${job.company}`;
  if (currentUser) {
    document.getElementById('applicantName').value = currentUser.name;
    document.getElementById('applicantEmail').value = currentUser.email;
  }
  openModal('applyModal');
}

function handleApplySubmit(e) {
  e.preventDefault();
  const jobId = parseInt(document.getElementById('applyJobId').value);
  const name = document.getElementById('applicantName').value;
  const email = document.getElementById('applicantEmail').value.trim().toLowerCase();
  const coverLetter = document.getElementById('coverLetter').value;
  const fileInput = document.getElementById('resumeUpload');
  const file = fileInput.files[0];

  // Prevent Duplicate Applications
  if (appState.applications.some(a => a.jobId === jobId && a.email === email)) {
    showToast("You have already applied for this job!", "danger");
    return;
  }

  // File size validation (Max 2MB to prevent localStorage QuotaExceededError)
  if (file.size > 2 * 1024 * 1024) {
    showToast("File size exceeds 2MB limit for local storage!", "danger");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const base64PDF = event.target.result; // Data URL string

    const newApp = {
      id: Date.now(),
      jobId: jobId,
      applicantName: name,
      email: email,
      coverLetter: coverLetter,
      resumeBase64: base64PDF,
      status: 'Submitted', // 'Submitted' | 'Shortlisted' | 'Rejected'
      appliedAt: new Date().toLocaleDateString()
    };

    appState.applications.push(newApp);
    syncStorage();
    closeModal('applyModal');
    document.getElementById('applyForm').reset();
    showToast("Application submitted successfully!");
    render();
  };

  reader.readAsDataURL(file);
}

// ==========================================
// 5. EMPLOYER DASHBOARD & CRUD
// ==========================================

function renderEmployerDashboard() {
  document.getElementById('statTotalJobs').innerText = appState.jobs.length;
  document.getElementById('statTotalApps').innerText = appState.applications.length;

  const tbody = document.getElementById('employerJobTableBody');

  if (appState.jobs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">No job postings available. Click "Post New Position" to create one.</td></tr>`;
    return;
  }

  tbody.innerHTML = appState.jobs.map(job => {
    const jobApps = appState.applications.filter(a => a.jobId === job.id);
    return `
      <tr>
        <td><strong>${escapeHTML(job.title)}</strong><br><small class="text-muted">${escapeHTML(job.company)}${job.location ? ' · ' + escapeHTML(job.location) : ''}</small></td>
        <td><span class="badge badge-blue">${escapeHTML(job.category)}</span></td>
        <td>${escapeHTML(job.type)}</td>
        <td><strong>${jobApps.length}</strong> candidates</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="viewApplicants(${job.id})">
            <i class="fa-solid fa-eye"></i> Applicants (${jobApps.length})
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteJob(${job.id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function handlePostJob(e) {
  e.preventDefault();
  const newJob = {
    id: Date.now(),
    title: document.getElementById('jobTitle').value,
    company: document.getElementById('companyName').value,
    location: document.getElementById('jobLocation').value,
    category: document.getElementById('jobCategory').value,
    type: document.getElementById('jobType').value,
    salary: document.getElementById('jobSalary').value,
    description: document.getElementById('jobDescription').value
  };

  appState.jobs.unshift(newJob);
  syncStorage();
  closeModal('postJobModal');
  document.getElementById('postJobForm').reset();
  showToast("New job posting published!");
  render();
}

function deleteJob(jobId) {
  if (confirm("Are you sure you want to delete this job posting? Associated applications will remain in records.")) {
    appState.jobs = appState.jobs.filter(j => j.id !== jobId);
    syncStorage();
    showToast("Job post removed.");
    render();
  }
}

function viewApplicants(jobId) {
  const job = appState.jobs.find(j => j.id === jobId);
  const apps = appState.applications.filter(a => a.jobId === jobId);
  const container = document.getElementById('applicantsListContainer');

  document.getElementById('applicantsModalTitle').innerText = `Applicants for ${job ? job.title : 'Position'}`;

  if (apps.length === 0) {
    container.innerHTML = `<p style="text-align:center; color: var(--text-muted); padding: 20px;">No applications submitted yet for this position.</p>`;
  } else {
    container.innerHTML = apps.map(app => `
      <div class="applicant-card">
        <div class="applicant-card-header">
          <div>
            <strong>${escapeHTML(app.applicantName)}</strong> (${escapeHTML(app.email)})
            <br><small class="text-muted">Applied on: ${app.appliedAt}</small>
          </div>
          <div>
            <select class="status-select" onchange="updateAppStatus(${app.id}, this.value)">
              <option value="Submitted" ${app.status === 'Submitted' ? 'selected' : ''}>Submitted</option>
              <option value="Shortlisted" ${app.status === 'Shortlisted' ? 'selected' : ''}>Shortlisted</option>
              <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
            </select>
          </div>
        </div>
        <p style="font-size:0.85rem; margin-bottom: 8px;"><em>"${escapeHTML(app.coverLetter || 'No cover letter provided.')}"</em></p>
        <a href="${app.resumeBase64}" download="Resume_${escapeHTML(app.applicantName)}.pdf" class="btn btn-secondary btn-sm">
          <i class="fa-solid fa-file-pdf"></i> Download Resume PDF
        </a>
      </div>
    `).join('');
  }

  openModal('viewApplicantsModal');
}

function updateAppStatus(appId, newStatus) {
  const app = appState.applications.find(a => a.id === appId);
  if (app) {
    app.status = newStatus;
    syncStorage();
    showToast(`Application status updated to ${newStatus}`);
  }
}

// ==========================================
// 6. UTILITIES & MODAL CONTROLLERS
// ==========================================

function updateCounters() {
  document.getElementById('savedCount').innerText = appState.savedJobIds.length;
  document.getElementById('appliedCount').innerText = myApplications().length;
}

function openModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

function resetPortalData() {
  if (confirm("Reset jobs, bookmarks and applications back to the demo data? Your account will be kept.")) {
    localStorage.removeItem('hp_jobs');
    localStorage.removeItem('hp_applications');
    if (currentUser) localStorage.removeItem('hp_savedJobs_' + currentUser.id);
    appState.jobs = SEED_JOBS.map(j => ({ ...j }));
    appState.savedJobIds = [];
    appState.applications = [];
    syncStorage();
    showToast("Portal data reset to default seed data.");
    render();
  }
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${escapeHTML(message)}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// ==========================================
// 7. AUTHENTICATION (LOGIN / SIGN UP)
// ==========================================
// NOTE: This is a front-end demo. Accounts live in this browser's localStorage,
// so it is NOT real security. A production portal needs a backend with a proper
// auth service (hashed passwords server-side, sessions/JWT, HTTPS).

const USERS_KEY = 'hp_users';
const SESSION_KEY = 'hp_session';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch (err) { return []; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function makeSalt() {
  if (window.crypto && crypto.getRandomValues) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  }
  return String(Date.now()) + Math.random().toString(16).slice(2);
}

async function hashPassword(password, salt) {
  const text = salt + password;
  if (window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for non-secure contexts where crypto.subtle is unavailable
  return btoa(unescape(encodeURIComponent(text)));
}

function myApplications() {
  if (!currentUser) return [];
  return appState.applications.filter(a => (a.email || '').toLowerCase() === currentUser.email);
}

function showAuthError(message) {
  const box = document.getElementById('authError');
  box.textContent = message;
  box.classList.remove('hidden');
}

function clearAuthError() {
  document.getElementById('authError').classList.add('hidden');
}

function switchAuthTab(tab) {
  const isLogin = tab === 'login';
  document.getElementById('loginForm').classList.toggle('hidden', !isLogin);
  document.getElementById('signupForm').classList.toggle('hidden', isLogin);
  document.getElementById('tabLogin').classList.toggle('active', isLogin);
  document.getElementById('tabSignup').classList.toggle('active', !isLogin);
  clearAuthError();
}

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  btn.innerHTML = `<i class="fa-regular fa-eye${show ? '-slash' : ''}"></i>`;
  btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
}

async function handleSignup(e) {
  e.preventDefault();
  clearAuthError();

  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const role = document.querySelector('input[name="signupRole"]:checked').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirm').value;

  if (name.length < 2) return showAuthError('Enter your full name.');
  if (password.length < 8) return showAuthError('Password must be at least 8 characters.');
  if (password !== confirmPassword) return showAuthError('Passwords do not match. Re-enter them and try again.');

  const users = getUsers();
  if (users.some(u => u.email === email)) {
    return showAuthError('An account with this email already exists. Log in instead.');
  }

  const salt = makeSalt();
  const user = {
    id: 'u' + Date.now(),
    name,
    email,
    role,
    salt,
    passwordHash: await hashPassword(password, salt),
    createdAt: new Date().toISOString()
  };
  users.push(user);
  saveUsers(users);

  localStorage.setItem(SESSION_KEY, user.id);
  document.getElementById('signupForm').reset();
  enterApp(user);
  showToast(`Welcome to HirePulse, ${name.split(' ')[0]}!`);
}

async function handleLogin(e) {
  e.preventDefault();
  clearAuthError();

  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const user = getUsers().find(u => u.email === email);

  if (!user || (await hashPassword(password, user.salt)) !== user.passwordHash) {
    return showAuthError('Incorrect email or password.');
  }

  localStorage.setItem(SESSION_KEY, user.id);
  document.getElementById('loginForm').reset();
  enterApp(user);
  showToast(`Welcome back, ${user.name.split(' ')[0]}!`);
}

function enterApp(user) {
  currentUser = user;
  appState.activeRole = user.role;
  appState.activeSeekerTab = 'all';
  try {
    appState.savedJobIds = JSON.parse(localStorage.getItem('hp_savedJobs_' + user.id)) || [];
  } catch (err) {
    appState.savedJobIds = [];
  }

  document.getElementById('authScreen').classList.add('hidden');
  document.getElementById('appHeader').classList.remove('hidden');
  document.getElementById('appMain').classList.remove('hidden');

  document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('userNameLabel').textContent = user.name;
  document.getElementById('userRoleLabel').textContent = user.role === 'employer' ? 'Employer / Recruiter' : 'Job Seeker';

  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('tabAllJobs').classList.add('active');
  document.getElementById('searchInput').value = '';
  document.getElementById('categoryFilter').value = 'all';
  document.getElementById('typeFilter').value = 'all';

  render();
}

function showAuthScreen() {
  currentUser = null;
  document.getElementById('authScreen').classList.remove('hidden');
  document.getElementById('appHeader').classList.add('hidden');
  document.getElementById('appMain').classList.add('hidden');
  switchAuthTab('login');
}

function restoreSession() {
  const sessionId = localStorage.getItem(SESSION_KEY);
  const user = sessionId ? getUsers().find(u => u.id === sessionId) : null;
  if (user) enterApp(user);
  else showAuthScreen();
}

function handleLogout() {
  localStorage.removeItem(SESSION_KEY);
  appState.savedJobIds = [];
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
  showAuthScreen();
  showToast('You have been logged out.');
}