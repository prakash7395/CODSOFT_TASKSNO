function searchJobs() {
    const searchInput = document.getElementById("searchInput");
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm === "") {
        alert("Please enter a job title to search.");
        return;
    }

    window.location.href = "jobs.html?search=" + encodeURIComponent(searchTerm);
}

function filterJobs() {
    const params = new URLSearchParams(window.location.search);
    const searchTerm = params.get("search");

    if (!searchTerm) {
        return;
    }

    const jobCards = document.querySelectorAll(".job-card");

    jobCards.forEach(function(card) {
        const jobText = card.innerText.toLowerCase();

        if (jobText.includes(searchTerm)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
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

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (email === "" || password === "") {
        alert("Please enter email and password.");
        return;
    }

    alert("Login successful!");

    window.location.href = "index.html";
}

filterJobs();
