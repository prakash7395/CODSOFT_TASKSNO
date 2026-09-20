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
    alert("You selected: " + jobTitle);
}
