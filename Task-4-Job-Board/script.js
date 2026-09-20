function searchJobs() {
    const searchInput = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");

    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm === "") {
        results.innerHTML = "<p>Please enter a job title to search.</p>";
        return;
    }

    const jobs = [
        {
            title: "Frontend Developer",
            company: "Tech Solutions",
            location: "Chennai, India"
        },
        {
            title: "Web Developer",
            company: "Digital Works",
            location: "Bangalore, India"
        },
        {
            title: "JavaScript Developer",
            company: "Innovate Labs",
            location: "Hyderabad, India"
        },
        {
            title: "UI Developer",
            company: "Creative Tech",
            location: "Chennai, India"
        }
    ];

    const matchingJobs = jobs.filter(function(job) {
        return (
            job.title.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm) ||
            job.location.toLowerCase().includes(searchTerm)
        );
    });

    if (matchingJobs.length === 0) {
        results.innerHTML = "<p>No jobs found.</p>";
        return;
    }

    results.innerHTML = "<h2>Search Results</h2>";

    matchingJobs.forEach(function(job) {
        results.innerHTML += `
            <div class="job-card">
                <h3>${job.title}</h3>
                <p>${job.company}</p>
                <p>📍 ${job.location}</p>
                <button onclick="viewJob('${job.title}')">
                    View Details
                </button>
            </div>
        `;
    });
}

function viewJob(jobTitle) {
    window.location.href = "job-details.html";
}

function submitApplication(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;

    alert("Application submitted successfully, " + name + "!");

    window.location.href = "index.html";
}

function loginUser(event) {
    event.preventDefault();

    alert("Login successful!");

    window.location.href = "index.html";
}
function postJob(event) {
    event.preventDefault();

    const jobTitle = document.getElementById("jobTitle").value;
    const companyName = document.getElementById("companyName").value;

    alert(
        "Job posted successfully!\n\n" +
        "Job: " + jobTitle +
        "\nCompany: " + companyName
    );

    window.location.href = "employer-dashboard.html";
}
