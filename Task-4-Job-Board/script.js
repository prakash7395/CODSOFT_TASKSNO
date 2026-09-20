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
