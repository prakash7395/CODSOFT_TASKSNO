function searchJobs() {
    const searchInput = document.getElementById("searchInput");
    const searchTerm = searchInput.value.trim();

    if (searchTerm === "") {
        alert("Please enter a job title to search.");
        return;
    }

    alert("Searching for: " + searchTerm);
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
