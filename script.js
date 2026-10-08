// ==========================================
// 1. GLOBAL STATE & LOCAL STORAGE
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
    description: "6-month paid internship for B.E./B.Tech students. Work with mentors on real features using JavaScript, Java or Python. PPO opportunity based on performance."
  },
  {
    id: 106,
    title: "Machine Learning Engineer",
    company: "NeuralNest AI",
    location: "Bengaluru, Karnataka",
    category: "Data & AI",
    type: "Full-time",
    salary: "₹20 - 35 LPA",
    description: "Build and deploy ML models for speech and text in Indian languages. Strong Python, PyTorch and MLOps fundamentals required."
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
    description: "Create engaging short-form content in Hindi plus one more regional language for Instagram, YouTube Shorts and ShareChat."
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
    description: "3-month remote internship for students. Create wireframes and prototypes in Figma for Indian startups."
  },
  {
    id: 112,
    title: "Cybersecurity Analyst",
    company: "SecureNet India",
    location: "Hyderabad, Telangana",
    category: "Engineering",
    type: "Full-time",
    salary: "₹9 - 16 LPA",
    description: "Monitor security events in our SOC, run vulnerability assessments and help meet RBI and CERT-In compliance requirements."
  }
];

let currentUser = null;

const ADMIN_EMAIL = "admin@hirepulse.com";
const ADMIN_PASSWORD = "Admin@12345";

const USERS_KEY = "hp_users";
const SESSION_KEY = "hp_session";

const SEED_VERSION = "2";

if (localStorage.getItem("hp_seedVersion") !== SEED_VERSION) {
  localStorage.removeItem("hp_jobs");
  localStorage.setItem("hp_seedVersion", SEED_VERSION);
}

let appState = {
  activeRole: "seeker",
  activeSeekerTab: "all",
  savedJobIds: [],
  jobs: JSON.parse(localStorage.getItem("hp_jobs")) || SEED_JOBS,
  applications: JSON.parse(localStorage.getItem("hp_applications")) || []
};


// ==========================================
// 2. STORAGE
// ==========================================

function syncStorage() {

  localStorage.setItem(
    "hp_seedVersion",
    SEED_VERSION
  );

  localStorage.setItem(
    "hp_jobs",
    JSON.stringify(appState.jobs)
  );

  localStorage.setItem(
    "hp_applications",
    JSON.stringify(appState.applications)
  );

  if (currentUser) {

    localStorage.setItem(
      "hp_savedJobs_" + currentUser.id,
      JSON.stringify(appState.savedJobIds)
    );
  }
}


// ==========================================
// 3. INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  if (!localStorage.getItem("hp_jobs")) {
    syncStorage();
  }

  ensureAdminAccount();

  document
    .querySelectorAll('input[name="signupRole"]')
    .forEach(input => {

      input.addEventListener(
        "change",
        updateSignupRoleFields
      );

    });

  updateSignupRoleFields();

  restoreSession();
});


// ==========================================
// 4. RENDER
// ==========================================

function render() {

  document
    .getElementById("seekerSection")
    .classList.add("hidden");

  document
    .getElementById("employerSection")
    .classList.add("hidden");

  document
    .getElementById("adminSection")
    .classList.add("hidden");


  if (appState.activeRole === "seeker") {

    document
      .getElementById("seekerSection")
      .classList.remove("hidden");

    renderSeekerGrid();

  }


  else if (appState.activeRole === "employer") {

    document
      .getElementById("employerSection")
      .classList.remove("hidden");

    renderEmployerDashboard();

  }


  else if (appState.activeRole === "admin") {

    document
      .getElementById("adminSection")
      .classList.remove("hidden");

    renderAdminDashboard();

  }

  updateCounters();
}


// ==========================================
// 5. JOB SEEKER
// ==========================================

function handleSearchAndFilter() {
  renderSeekerGrid();
}


function switchSeekerTab(tabName) {

  appState.activeSeekerTab = tabName;

  document
    .querySelectorAll(".tab-btn")
    .forEach(btn => btn.classList.remove("active"));


  if (tabName === "all") {
    document
      .getElementById("tabAllJobs")
      .classList.add("active");
  }


  if (tabName === "saved") {
    document
      .getElementById("tabSavedJobs")
      .classList.add("active");
  }


  if (tabName === "applied") {
    document
      .getElementById("tabMyApps")
      .classList.add("active");
  }

  renderSeekerGrid();
}


function renderSeekerGrid() {

  const container =
    document.getElementById("jobGrid");

  const searchVal =
    document
      .getElementById("searchInput")
      .value
      .toLowerCase()
      .trim();

  const categoryVal =
    document.getElementById("categoryFilter").value;

  const typeVal =
    document.getElementById("typeFilter").value;


  let filtered = appState.jobs.filter(job => {

    const matchesSearch =
      job.title.toLowerCase().includes(searchVal) ||
      job.company.toLowerCase().includes(searchVal) ||
      (job.location || "")
        .toLowerCase()
        .includes(searchVal) ||
      job.description
        .toLowerCase()
        .includes(searchVal);

    const matchesCategory =
      categoryVal === "all" ||
      job.category === categoryVal;

    const matchesType =
      typeVal === "all" ||
      job.type === typeVal;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesType
    );
  });


  if (appState.activeSeekerTab === "saved") {

    filtered = filtered.filter(job =>
      appState.savedJobIds.includes(job.id)
    );

  }


  else if (appState.activeSeekerTab === "applied") {

    const appliedJobIds =
      myApplications().map(app => app.jobId);

    filtered = filtered.filter(job =>
      appliedJobIds.includes(job.id)
    );

  }


  document.getElementById("jobCountBadge").innerText =
    `Showing ${filtered.length} of ${appState.jobs.length} jobs`;


  if (filtered.length === 0) {

    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">
        <i class="fa-solid fa-folder-open"
           style="font-size:2.5rem;margin-bottom:10px;"></i>

        <p>No jobs found matching your criteria.</p>
      </div>
    `;

    return;
  }


  container.innerHTML =
    filtered.map(job => {

      const isSaved =
        appState.savedJobIds.includes(job.id);

      const hasApplied =
        myApplications().some(
          app => app.jobId === job.id
        );


      return `
        <div class="job-card">

          <div>

            <div class="job-card-header">

              <h3>
                ${escapeHTML(job.title)}
              </h3>

              <button
                class="bookmark-btn ${isSaved ? "active" : ""}"
                onclick="toggleBookmark(${job.id})">

                <i class="fa-solid fa-bookmark"></i>

              </button>

            </div>


            <p class="company-name">
              ${escapeHTML(job.company)}
            </p>


            <div class="job-meta">

              <span>
                <i class="fa-solid fa-location-dot"></i>
                ${escapeHTML(job.location)}
              </span>

              <span>
                <i class="fa-solid fa-briefcase"></i>
                ${escapeHTML(job.type)}
              </span>

            </div>


            <div class="job-tags">

              <span class="tag">
                ${escapeHTML(job.category)}
              </span>

              <span class="tag">
                ${escapeHTML(job.salary)}
              </span>

            </div>


            <p class="job-description">
              ${escapeHTML(job.description)}
            </p>

          </div>


          <div class="job-card-footer">

            ${
              hasApplied
              ? `
                <button
                  class="btn btn-secondary"
                  disabled>
                  <i class="fa-solid fa-check"></i>
                  Applied
                </button>
              `
              : `
                <button
                  class="btn btn-primary"
                  onclick="openApplyModal(${job.id})">
                  Apply Now
                </button>
              `
            }

          </div>

        </div>
      `;

    }).join("");
}


// ==========================================
// 6. BOOKMARKS
// ==========================================

function toggleBookmark(jobId) {

  const index =
    appState.savedJobIds.indexOf(jobId);


  if (index > -1) {

    appState.savedJobIds.splice(index, 1);

    showToast("Job removed from bookmarks.");

  }

  else {

    appState.savedJobIds.push(jobId);

    showToast("Job bookmarked.");

  }


  syncStorage();

  renderSeekerGrid();

  updateCounters();
}


// ==========================================
// 7. EMPLOYER FILTERING
// ==========================================

function employerJobs() {

  if (!currentUser) {
    return [];
  }

  return appState.jobs.filter(
    job => job.ownerId === currentUser.id
  );
}


function employerApplications() {

  const jobs =
    employerJobs();

  const jobIds =
    jobs.map(job => job.id);

  return appState.applications.filter(
    app => jobIds.includes(app.jobId)
  );
}


// ==========================================
// 8. EMPLOYER DASHBOARD
// ==========================================

function renderEmployerDashboard() {

  const jobs =
    employerJobs();

  const applications =
    employerApplications();


  document.getElementById("statTotalJobs").innerText =
    jobs.length;

  document.getElementById("statTotalApps").innerText =
    applications.length;


  const tbody =
    document.getElementById("employerJobTableBody");


  if (jobs.length === 0) {

    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-table">
          You have not posted any jobs yet.
        </td>
      </tr>
    `;

    return;
  }


  tbody.innerHTML =
    jobs.map(job => {

      const count =
        applications.filter(
          app => app.jobId === job.id
        ).length;


      return `
        <tr>

          <td>
            <strong>
              ${escapeHTML(job.title)}
            </strong>
          </td>

          <td>
            ${escapeHTML(job.category)}
          </td>

          <td>
            ${escapeHTML(job.type)}
          </td>

          <td>
            ${count}
          </td>

          <td>

            <button
              class="btn btn-secondary btn-sm"
              onclick="viewApplicants(${job.id})">

              View Applicants

            </button>


            <button
              class="btn btn-danger btn-sm"
              onclick="deleteJob(${job.id})">

              Delete

            </button>

          </td>

        </tr>
      `;

    }).join("");
}


// ==========================================
// 9. POST JOB
// ==========================================

function openPostJobModal() {

  if (!currentUser) {
    return;
  }


  if (
    currentUser.role !== "employer"
  ) {

    showToast(
      "Only recruiters can post jobs.",
      "error"
    );

    return;
  }


  if (!currentUser.approved) {

    showToast(
      "Your recruiter account is waiting for admin approval.",
      "error"
    );

    return;
  }


  document.getElementById("companyName").value =
    currentUser.company || "";

  openModal("postJobModal");
}


function handlePostJob(event) {

  event.preventDefault();


  if (
    !currentUser ||
    currentUser.role !== "employer"
  ) {

    showToast(
      "You are not authorized to post jobs.",
      "error"
    );

    return;
  }


  if (!currentUser.approved) {

    showToast(
      "Your recruiter account has not been approved.",
      "error"
    );

    return;
  }


  const job = {

    id: Date.now(),

    ownerId: currentUser.id,

    title:
      document.getElementById("jobTitle").value.trim(),

    company:
      currentUser.company,

    category:
      document.getElementById("jobCategory").value,

    type:
      document.getElementById("jobType").value,

    salary:
      document.getElementById("jobSalary").value.trim(),

    location:
      document.getElementById("jobLocation").value.trim(),

    description:
      document.getElementById("jobDescription").value.trim(),

    createdAt:
      new Date().toISOString()

  };


  if (!job.title ||
      !job.company ||
      !job.salary ||
      !job.location ||
      !job.description) {

    showToast(
      "Please fill all required fields.",
      "error"
    );

    return;
  }


  appState.jobs.push(job);

  syncStorage();

  document.getElementById("postJobForm").reset();

  document.getElementById("companyName").value =
    currentUser.company || "";

  closeModal("postJobModal");

  showToast("Job posted successfully.");

  render();
}


// ==========================================
// 10. DELETE JOB
// ==========================================

function deleteJob(jobId) {

  const job =
    appState.jobs.find(
      item => item.id === jobId
    );

  if (!job) return;


  const isAdmin =
    currentUser &&
    currentUser.role === "admin";


  const isOwner =
    currentUser &&
    job.ownerId === currentUser.id;


  if (!isAdmin && !isOwner) {

    showToast(
      "You are not authorized to delete this job.",
      "error"
    );

    return;
  }


  if (
    !confirm(
      `Delete "${job.title}"?`
    )
  ) {
    return;
  }


  appState.jobs =
    appState.jobs.filter(
      item => item.id !== jobId
    );


  appState.applications =
    appState.applications.filter(
      app => app.jobId !== jobId
    );


  syncStorage();

  showToast("Job deleted.");

  render();
}


// ==========================================
// 11. APPLY
// ==========================================

function openApplyModal(jobId) {

  if (!currentUser) return;


  if (currentUser.role !== "seeker") {

    showToast(
      "Only job seekers can apply.",
      "error"
    );

    return;
  }


  const job =
    appState.jobs.find(
      item => item.id === jobId
    );

  if (!job) return;


  const alreadyApplied =
    myApplications().some(
      app => app.jobId === jobId
    );


  if (alreadyApplied) {

    showToast(
      "You have already applied for this job.",
      "error"
    );

    return;
  }


  document.getElementById("applyJobId").value =
    jobId;

  document.getElementById("applyModalTitle").innerText =
    `Apply for ${job.title}`;

  document.getElementById("applicantName").value =
    currentUser.name;

  document.getElementById("applicantEmail").value =
    currentUser.email;

  document.getElementById("coverLetter").value = "";

  document.getElementById("resumeUpload").value = "";

  openModal("applyModal");
}


function handleApplySubmit(event) {

  event.preventDefault();


  if (
    !currentUser ||
    currentUser.role !== "seeker"
  ) {

    showToast(
      "Only job seekers can apply.",
      "error"
    );

    return;
  }


  const jobId =
    Number(
      document.getElementById("applyJobId").value
    );


  const job =
    appState.jobs.find(
      item => item.id === jobId
    );


  if (!job) {

    showToast(
      "Job not found.",
      "error"
    );

    return;
  }


  if (
    myApplications().some(
      app => app.jobId === jobId
    )
  ) {

    showToast(
      "You have already applied for this job.",
      "error"
    );

    closeModal("applyModal");

    return;
  }


  const resumeInput =
    document.getElementById("resumeUpload");

  const file =
    resumeInput.files[0];


  if (!file) {

    showToast(
      "Please upload your resume.",
      "error"
    );

    return;
  }


  if (
    file.type !== "application/pdf" &&
    !file.name.toLowerCase().endsWith(".pdf")
  ) {

    showToast(
      "Only PDF resumes are allowed.",
      "error"
    );

    return;
  }


  if (file.size > 2 * 1024 * 1024) {

    showToast(
      "Resume must be smaller than 2MB.",
      "error"
    );

    return;
  }


  const reader =
    new FileReader();


  reader.onload = function () {

    const application = {

      id: Date.now(),

      jobId: job.id,

      applicantUserId:
        currentUser.id,

      applicantName:
        document
          .getElementById("applicantName")
          .value
          .trim(),

      email:
        currentUser.email,

      coverLetter:
        document
          .getElementById("coverLetter")
          .value
          .trim(),

      resumeName:
        file.name,

      resumeData:
        reader.result,

      status:
        "Applied",

      appliedAt:
        new Date().toISOString()

    };


    appState.applications.push(
      application
    );

    syncStorage();

    closeModal("applyModal");

    showToast(
      "Application submitted successfully."
    );

    render();

  };


  reader.readAsDataURL(file);
}


// ==========================================
// 12. VIEW APPLICANTS
// ==========================================

function viewApplicants(jobId) {

  if (!currentUser) return;


  const job =
    appState.jobs.find(
      item => item.id === jobId
    );


  if (!job) return;


  const isAdmin =
    currentUser.role === "admin";


  const isOwner =
    currentUser.role === "employer" &&
    job.ownerId === currentUser.id;


  if (!isAdmin && !isOwner) {

    showToast(
      "You are not authorized to view these applicants.",
      "error"
    );

    return;
  }


  const applications =
    appState.applications.filter(
      app => app.jobId === jobId
    );


  document.getElementById("applicantsModalTitle").innerText =
    `Applicants for ${job.title}`;


  const container =
    document.getElementById(
      "applicantsListContainer"
    );


  if (applications.length === 0) {

    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-users"></i>
        <p>No applicants yet.</p>
      </div>
    `;

  }

  else {

    container.innerHTML =
      applications.map(app => {

        return `
          <div class="applicant-card">

            <div class="applicant-info">

              <h4>
                ${escapeHTML(app.applicantName)}
              </h4>

              <p>
                ${escapeHTML(app.email)}
              </p>

              <p>
                Status:
                <strong>
                  ${escapeHTML(app.status)}
                </strong>
              </p>

              ${
                app.coverLetter
                ? `
                  <p>
                    ${escapeHTML(app.coverLetter)}
                  </p>
                `
                : ""
              }

              ${
                app.resumeData
                ? `
                  <a
                    href="${app.resumeData}"
                    download="${escapeHTML(app.resumeName || "resume.pdf")}"
                    class="btn btn-secondary btn-sm">

                    Download Resume

                  </a>
                `
                : ""
              }

            </div>


            <div class="applicant-actions">

              <select
                onchange="updateApplicationStatus(${app.id}, this.value)">

                <option
                  value="Applied"
                  ${app.status === "Applied" ? "selected" : ""}>
                  Applied
                </option>

                <option
                  value="Shortlisted"
                  ${app.status === "Shortlisted" ? "selected" : ""}>
                  Shortlisted
                </option>

                <option
                  value="Interview"
                  ${app.status === "Interview" ? "selected" : ""}>
                  Interview
                </option>

                <option
                  value="Selected"
                  ${app.status === "Selected" ? "selected" : ""}>
                  Selected
                </option>

                <option
                  value="Rejected"
                  ${app.status === "Rejected" ? "selected" : ""}>
                  Rejected
                </option>

              </select>

            </div>

          </div>
        `;

      }).join("");

  }


  openModal("viewApplicantsModal");
}


// ==========================================
// 13. APPLICATION STATUS
// ==========================================

function updateApplicationStatus(
  applicationId,
  status
) {

  if (!currentUser) return;


  const application =
    appState.applications.find(
      app => app.id === applicationId
    );


  if (!application) return;


  const job =
    appState.jobs.find(
      item => item.id === application.jobId
    );


  if (!job) return;


  const authorized =
    currentUser.role === "admin" ||
    (
      currentUser.role === "employer" &&
      job.ownerId === currentUser.id
    );


  if (!authorized) {

    showToast(
      "You are not authorized to change this status.",
      "error"
    );

    return;
  }


  application.status = status;

  syncStorage();

  showToast(
    "Application status updated."
  );

  render();
}


// ==========================================
// 14. ADMIN DASHBOARD
// ==========================================

function renderAdminDashboard() {

  if (
    !currentUser ||
    currentUser.role !== "admin"
  ) {
    return;
  }


  const users =
    getUsers();

  const recruiters =
    users.filter(
      user => user.role === "employer"
    );


  document.getElementById(
    "adminUserCount"
  ).innerText =
    users.filter(
      user => user.role !== "admin"
    ).length;


  document.getElementById(
    "adminEmployerCount"
  ).innerText =
    recruiters.length;


  document.getElementById(
    "adminJobCount"
  ).innerText =
    appState.jobs.length;


  document.getElementById(
    "adminApplicationCount"
  ).innerText =
    appState.applications.length;


  renderAdminRecruiters(
    recruiters
  );

  renderAdminUsers(
    users
  );

  renderAdminJobs();

  renderAdminApplications();
}


// ==========================================
// 15. ADMIN RECRUITERS
// ==========================================

function renderAdminRecruiters(
  recruiters
) {

  const tbody =
    document.getElementById(
      "adminRecruiterTableBody"
    );


  if (recruiters.length === 0) {

    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-table">
          No recruiter accounts.
        </td>
      </tr>
    `;

    return;
  }


  tbody.innerHTML =
    recruiters.map(user => {

      const status =
        user.approved
        ? "Approved"
        : "Pending";


      return `
        <tr>

          <td>
            ${escapeHTML(user.name)}
          </td>

          <td>
            ${escapeHTML(user.company || "-")}
          </td>

          <td>
            ${escapeHTML(user.email)}
          </td>

          <td>

            <span class="badge ${
              user.approved
              ? "badge-green"
              : "badge-yellow"
            }">

              ${status}

            </span>

          </td>

          <td>

            <button
              class="btn btn-secondary btn-sm"
              onclick="toggleRecruiterApproval('${user.id}')">

              ${
                user.approved
                ? "Suspend"
                : "Approve"
              }

            </button>


            <button
              class="btn btn-danger btn-sm"
              onclick="deleteUser('${user.id}')">

              Delete

            </button>

          </td>

        </tr>
      `;

    }).join("");
}


// ==========================================
// 16. ADMIN USERS
// ==========================================

function renderAdminUsers(users) {

  const tbody =
    document.getElementById(
      "adminUserTableBody"
    );


  tbody.innerHTML =
    users.map(user => {

      return `
        <tr>

          <td>
            ${escapeHTML(user.name)}
          </td>

          <td>
            ${escapeHTML(user.email)}
          </td>

          <td>
            ${
              user.role === "admin"
              ? "Admin"
              : user.role === "employer"
              ? "Recruiter"
              : "Job Seeker"
            }
          </td>

          <td>
            ${escapeHTML(user.company || "-")}
          </td>

          <td>

            ${
              user.role === "admin"
              ? "<span>Protected</span>"
              : `
                <button
                  class="btn btn-danger btn-sm"
                  onclick="deleteUser('${user.id}')">

                  Delete

                </button>
              `
            }

          </td>

        </tr>
      `;

    }).join("");
}


// ==========================================
// 17. ADMIN JOBS
// ==========================================

function renderAdminJobs() {

  const tbody =
    document.getElementById(
      "adminJobTableBody"
    );


  if (appState.jobs.length === 0) {

    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-table">
          No job postings.
        </td>
      </tr>
    `;

    return;
  }


  tbody.innerHTML =
    appState.jobs.map(job => {

      const recruiter =
        getUsers().find(
          user => user.id === job.ownerId
        );


      const count =
        appState.applications.filter(
          app => app.jobId === job.id
        ).length;


      return `
        <tr>

          <td>
            ${escapeHTML(job.title)}
          </td>

          <td>
            ${escapeHTML(job.company)}
          </td>

          <td>
            ${escapeHTML(
              recruiter
              ? recruiter.name
              : "Demo / Legacy"
            )}
          </td>

          <td>
            ${count}
          </td>

          <td>

            <button
              class="btn btn-secondary btn-sm"
              onclick="viewApplicants(${job.id})">

              View Applicants

            </button>


            <button
              class="btn btn-danger btn-sm"
              onclick="deleteJob(${job.id})">

              Delete

            </button>

          </td>

        </tr>
      `;

    }).join("");
}


// ==========================================
// 18. ADMIN APPLICATIONS
// ==========================================

function renderAdminApplications() {

  const tbody =
    document.getElementById(
      "adminApplicationTableBody"
    );


  if (appState.applications.length === 0) {

    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-table">
          No applications.
        </td>
      </tr>
    `;

    return;
  }


  const users =
    getUsers();


  tbody.innerHTML =
    appState.applications.map(app => {

      const job =
        appState.jobs.find(
          item => item.id === app.jobId
        );


      return `
        <tr>

          <td>
            ${escapeHTML(app.applicantName)}
          </td>

          <td>
            ${escapeHTML(app.email)}
          </td>

          <td>
            ${escapeHTML(
              job ? job.company : "-"
            )}
          </td>

          <td>
            ${escapeHTML(
              job ? job.title : "Deleted Job"
            )}
          </td>

          <td>

            <select
              onchange="updateApplicationStatus(${app.id}, this.value)">

              <option
                value="Applied"
                ${app.status === "Applied" ? "selected" : ""}>
                Applied
              </option>

              <option
                value="Shortlisted"
                ${app.status === "Shortlisted" ? "selected" : ""}>
                Shortlisted
              </option>

              <option
                value="Interview"
                ${app.status === "Interview" ? "selected" : ""}>
                Interview
              </option>

              <option
                value="Selected"
                ${app.status === "Selected" ? "selected" : ""}>
                Selected
              </option>

              <option
                value="Rejected"
                ${app.status === "Rejected" ? "selected" : ""}>
                Rejected
              </option>

            </select>

          </td>

        </tr>
      `;

    }).join("");
}


// ==========================================
// 19. ADMIN RECRUITER APPROVAL
// ==========================================

function toggleRecruiterApproval(
  userId
) {

  if (
    !currentUser ||
    currentUser.role !== "admin"
  ) {
    return;
  }


  const users =
    getUsers();


  const user =
    users.find(
      item => item.id === userId
    );


  if (
    !user ||
    user.role !== "employer"
  ) {
    return;
  }


  user.approved =
    !user.approved;


  saveUsers(users);

  showToast(
    user.approved
    ? "Recruiter approved."
    : "Recruiter suspended."
  );

  render();
}


// ==========================================
// 20. DELETE USER
// ==========================================

function deleteUser(userId) {

  if (
    !currentUser ||
    currentUser.role !== "admin"
  ) {
    return;
  }


  const users =
    getUsers();


  const user =
    users.find(
      item => item.id === userId
    );


  if (!user) return;


  if (
    user.email === ADMIN_EMAIL
  ) {

    showToast(
      "The admin account cannot be deleted.",
      "error"
    );

    return;
  }


  if (
    !confirm(
      `Delete account for ${user.name}?`
    )
  ) {
    return;
  }


  const ownedJobIds =
    appState.jobs
      .filter(job => job.ownerId === userId)
      .map(job => job.id);


  appState.jobs =
    appState.jobs.filter(
      job => job.ownerId !== userId
    );


  appState.applications =
    appState.applications.filter(
      app =>
        !ownedJobIds.includes(app.jobId) &&
        app.applicantUserId !== userId
    );


  saveUsers(
    users.filter(
      item => item.id !== userId
    )
  );


  localStorage.removeItem(
    "hp_savedJobs_" + userId
  );


  syncStorage();

  showToast(
    "User account deleted."
  );

  render();
}


// ==========================================
// 21. COUNTERS
// ==========================================

function updateCounters() {

  if (!currentUser) return;


  const savedCount =
    document.getElementById("savedCount");

  const appliedCount =
    document.getElementById("appliedCount");


  if (savedCount) {
    savedCount.innerText =
      appState.savedJobIds.length;
  }


  if (appliedCount) {
    appliedCount.innerText =
      myApplications().length;
  }
}


// ==========================================
// 22. MODALS
// ==========================================

function openModal(modalId) {

  document
    .getElementById(modalId)
    .classList.remove("hidden");
}


function closeModal(modalId) {

  document
    .getElementById(modalId)
    .classList.add("hidden");
}


// ==========================================
// 23. RESET DATA
// ==========================================

function resetPortalData() {

  if (
    !confirm(
      "Reset jobs, bookmarks and applications back to the demo data? Your account will be kept."
    )
  ) {
    return;
  }


  localStorage.removeItem(
    "hp_jobs"
  );

  localStorage.removeItem(
    "hp_applications"
  );


  if (currentUser) {

    localStorage.removeItem(
      "hp_savedJobs_" + currentUser.id
    );

  }


  appState.jobs =
    SEED_JOBS.map(job => ({
      ...job
    }));

  appState.savedJobIds = [];

  appState.applications = [];


  syncStorage();

  showToast(
    "Portal data reset to default seed data."
  );

  render();
}


// ==========================================
// 24. TOAST
// ==========================================

function showToast(
  message,
  type = "success"
) {

  const container =
    document.getElementById(
      "toastContainer"
    );


  const toast =
    document.createElement("div");


  toast.className =
    `toast ${type}`;


  toast.innerHTML =
    `<i class="fa-solid fa-circle-info"></i>
     ${escapeHTML(message)}`;


  container.appendChild(toast);


  setTimeout(() => {
    toast.remove();
  }, 3000);
}


// ==========================================
// 25. ESCAPE HTML
// ==========================================

function escapeHTML(str) {

  if (!str) return "";


  return String(str).replace(
    /[&<>'"]/g,
    tag =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      }[tag] || tag)
  );
}


// ==========================================
// 26. AUTHENTICATION
// ==========================================

function getUsers() {

  try {

    return (
      JSON.parse(
        localStorage.getItem(USERS_KEY)
      ) || []
    );

  }

  catch (error) {

    return [];

  }
}


function saveUsers(users) {

  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );
}


function makeSalt() {

  if (
    window.crypto &&
    crypto.getRandomValues
  ) {

    const bytes =
      new Uint8Array(16);


    crypto.getRandomValues(bytes);


    return Array.from(
      bytes,
      byte =>
        byte
          .toString(16)
          .padStart(2, "0")
    ).join("");

  }


  return (
    String(Date.now()) +
    Math.random()
      .toString(16)
      .slice(2)
  );
}


async function hashPassword(
  password,
  salt
) {

  const text =
    salt + password;


  if (
    window.crypto &&
    crypto.subtle
  ) {

    const buffer =
      await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(text)
      );


    return Array.from(
      new Uint8Array(buffer),
      byte =>
        byte
          .toString(16)
          .padStart(2, "0")
    ).join("");
  }


  return btoa(
    unescape(
      encodeURIComponent(text)
    )
  );
}


// ==========================================
// 27. MY APPLICATIONS
// ==========================================

function myApplications() {

  if (!currentUser) {
    return [];
  }


  return appState.applications.filter(
    app =>
      app.applicantUserId
      ? app.applicantUserId === currentUser.id
      : (
        app.email || ""
      ).toLowerCase() ===
        currentUser.email
  );
}


// ==========================================
// 28. AUTH ERROR
// ==========================================

function showAuthError(message) {

  const box =
    document.getElementById(
      "authError"
    );


  box.textContent =
    message;


  box.classList.remove(
    "hidden"
  );
}


function clearAuthError() {

  document
    .getElementById("authError")
    .classList.add("hidden");
}


// ==========================================
// 29. AUTH TABS
// ==========================================

function switchAuthTab(tab) {

  const isLogin =
    tab === "login";


  document
    .getElementById("loginForm")
    .classList.toggle(
      "hidden",
      !isLogin
    );


  document
    .getElementById("signupForm")
    .classList.toggle(
      "hidden",
      isLogin
    );


  document
    .getElementById("tabLogin")
    .classList.toggle(
      "active",
      isLogin
    );


  document
    .getElementById("tabSignup")
    .classList.toggle(
      "active",
      !isLogin
    );


  clearAuthError();
}


// ==========================================
// 30. PASSWORD TOGGLE
// ==========================================

function togglePassword(
  inputId,
  button
) {

  const input =
    document.getElementById(
      inputId
    );


  const show =
    input.type === "password";


  input.type =
    show
    ? "text"
    : "password";


  button.innerHTML =
    `<i class="fa-regular fa-eye${
      show ? "-slash" : ""
    }"></i>`;


  button.setAttribute(
    "aria-label",
    show
    ? "Hide password"
    : "Show password"
  );
}


// ==========================================
// 31. EMAIL VALIDATION
// ==========================================

function isValidEmail(email) {

  return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/
    .test(email);
}


// ==========================================
// 32. SIGNUP ROLE
// ==========================================

function updateSignupRoleFields() {

  const selected =
    document.querySelector(
      'input[name="signupRole"]:checked'
    );


  const group =
    document.getElementById(
      "companySignupGroup"
    );


  const input =
    document.getElementById(
      "signupCompany"
    );


  const isEmployer =
    selected &&
    selected.value === "employer";


  group.classList.toggle(
    "hidden",
    !isEmployer
  );


  input.required =
    isEmployer;


  if (!isEmployer) {
    input.value = "";
  }
}


// ==========================================
// 33. SIGNUP
// ==========================================

async function handleSignup(event) {

  event.preventDefault();

  clearAuthError();


  const name =
    document
      .getElementById("signupName")
      .value
      .trim();


  const email =
    document
      .getElementById("signupEmail")
      .value
      .trim()
      .toLowerCase();


  const role =
    document.querySelector(
      'input[name="signupRole"]:checked'
    ).value;


  const company =
    document
      .getElementById("signupCompany")
      .value
      .trim();


  const password =
    document.getElementById(
      "signupPassword"
    ).value;


  const confirmPassword =
    document.getElementById(
      "signupConfirm"
    ).value;


  if (name.length < 2) {

    return showAuthError(
      "Enter your full name."
    );

  }


  if (!isValidEmail(email)) {

    return showAuthError(
      "Enter a complete email address, for example: shreya@gmail.com"
    );

  }


  if (
    role === "employer" &&
    company.length < 2
  ) {

    return showAuthError(
      "Enter your company name."
    );

  }


  if (password.length < 8) {

    return showAuthError(
      "Password must be at least 8 characters."
    );

  }


  if (password !== confirmPassword) {

    return showAuthError(
      "Passwords do not match. Re-enter them and try again."
    );

  }


  const users =
    getUsers();


  if (
    users.some(
      user => user.email === email
    )
  ) {

    return showAuthError(
      "An account with this email already exists. Log in instead."
    );

  }


  const salt =
    makeSalt();


  const user = {

    id:
      "u" + Date.now(),

    name,

    email,

    role,

    company:
      role === "employer"
      ? company
      : "",

    approved:
      role === "seeker",

    salt,

    passwordHash:
      await hashPassword(
        password,
        salt
      ),

    createdAt:
      new Date().toISOString()

  };


  users.push(user);

  saveUsers(users);


  localStorage.setItem(
    SESSION_KEY,
    user.id
  );


  document
    .getElementById("signupForm")
    .reset();


  enterApp(user);


  if (role === "employer") {

    showToast(
      "Account created. Your recruiter account is waiting for admin approval."
    );

  }

  else {

    showToast(
      `Welcome to HirePulse, ${name.split(" ")[0]}!`
    );

  }
}


// ==========================================
// 34. LOGIN
// ==========================================

async function handleLogin(event) {

  event.preventDefault();

  clearAuthError();


  const email =
    document
      .getElementById("loginEmail")
      .value
      .trim()
      .toLowerCase();


  const password =
    document
      .getElementById("loginPassword")
      .value;


  if (!isValidEmail(email)) {

    return showAuthError(
      "Enter your full email address, for example: shreya@gmail.com"
    );

  }


  if (email === ADMIN_EMAIL) {

    if (
      password !== ADMIN_PASSWORD
    ) {

      return showAuthError(
        "The admin account already exists, but the password is incorrect."
      );

    }


    const admin =
      getUsers().find(
        user => user.email === ADMIN_EMAIL
      );


    localStorage.setItem(
      SESSION_KEY,
      admin.id
    );


    document
      .getElementById("loginForm")
      .reset();


    enterApp(admin);


    showToast(
      "Welcome back, Admin!"
    );


    return;
  }


  const user =
    getUsers().find(
      item => item.email === email
    );


  if (!user) {

    return showAuthError(
      "No account found with this email. Please create an account first."
    );

  }


  const passwordHash =
    await hashPassword(
      password,
      user.salt
    );


  if (
    passwordHash !==
    user.passwordHash
  ) {

    return showAuthError(
      "This account already exists, but the password is incorrect."
    );

  }


  if (
    user.role === "employer" &&
    !user.approved
  ) {

    return showAuthError(
      "Your recruiter account exists, but it is waiting for admin approval."
    );

  }


  localStorage.setItem(
    SESSION_KEY,
    user.id
  );


  document
    .getElementById("loginForm")
    .reset();


  enterApp(user);


  showToast(
    `Welcome back, ${user.name.split(" ")[0]}!`
  );
}


// ==========================================
// 35. ENTER APP
// ==========================================

function enterApp(user) {

  currentUser =
    user;


  appState.activeRole =
    user.role;


  appState.activeSeekerTab =
    "all";


  try {

    appState.savedJobIds =
      JSON.parse(
        localStorage.getItem(
          "hp_savedJobs_" + user.id
        )
      ) || [];

  }

  catch (error) {

    appState.savedJobIds = [];

  }


  document
    .getElementById("authScreen")
    .classList.add("hidden");


  document
    .getElementById("appHeader")
    .classList.remove("hidden");


  document
    .getElementById("appMain")
    .classList.remove("hidden");


  document
    .getElementById("userAvatar")
    .textContent =
      user.name
        .charAt(0)
        .toUpperCase();


  document
    .getElementById("userNameLabel")
    .textContent =
      user.name;


  document
    .getElementById("userRoleLabel")
    .textContent =
      user.role === "admin"
      ? "Administrator"
      : user.role === "employer"
      ? `Employer / ${user.company || "Recruiter"}`
      : "Job Seeker";


  if (
    user.role === "employer"
  ) {

    document
      .getElementById("companyName")
      .value =
        user.company || "";

  }


  document
    .querySelectorAll(".tab-btn")
    .forEach(
      btn =>
        btn.classList.remove("active")
    );


  document
    .getElementById("tabAllJobs")
    .classList.add("active");


  document
    .getElementById("searchInput")
    .value = "";


  document
    .getElementById("categoryFilter")
    .value = "all";


  document
    .getElementById("typeFilter")
    .value = "all";


  render();
}


// ==========================================
// 36. SHOW AUTH SCREEN
// ==========================================

function showAuthScreen() {

  currentUser =
    null;


  document
    .getElementById("authScreen")
    .classList.remove("hidden");


  document
    .getElementById("appHeader")
    .classList.add("hidden");


  document
    .getElementById("appMain")
    .classList.add("hidden");


  switchAuthTab("login");
}


// ==========================================
// 37. ADMIN ACCOUNT
// ==========================================

function ensureAdminAccount() {

  const users =
    getUsers();


  if (
    !users.some(
      user => user.email === ADMIN_EMAIL
    )
  ) {

    const salt =
      makeSalt();


    users.push({

      id:
        "admin-" + Date.now(),

      name:
        "HirePulse Admin",

      email:
        ADMIN_EMAIL,

      role:
        "admin",

      company:
        "HirePulse",

      approved:
        true,

      salt,

      passwordHash:
        null,

      createdAt:
        new Date().toISOString()

    });


    saveUsers(users);
  }
}


// ==========================================
// 38. RESTORE SESSION
// ==========================================

function restoreSession() {

  const sessionId =
    localStorage.getItem(
      SESSION_KEY
    );


  const user =
    sessionId
    ? getUsers().find(
        item => item.id === sessionId
      )
    : null;


  if (user) {

    if (
      user.role === "employer" &&
      !user.approved
    ) {

      localStorage.removeItem(
        SESSION_KEY
      );

      showAuthScreen();

      return;
    }


    enterApp(user);

  }

  else {

    showAuthScreen();

  }
}


// ==========================================
// 39. LOGOUT
// ==========================================

function handleLogout() {

  localStorage.removeItem(
    SESSION_KEY
  );


  appState.savedJobIds = [];


  document
    .querySelectorAll(".modal-overlay")
    .forEach(
      modal =>
        modal.classList.add("hidden")
    );


  showAuthScreen();


  showToast(
    "You have been logged out."
  );
}