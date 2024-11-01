// Initialize an array to hold activities
let activities = JSON.parse(localStorage.getItem('activities')) || [];

// Function to render activities
function renderActivities() {
    const activitiesContainer = document.getElementById('activitiesContainer');
    activitiesContainer.innerHTML = ''; // Clear previous activities
    activities.forEach((activity, index) => {
        const activityCard = document.createElement('div');
        activityCard.className = 'activity-card';
        activityCard.innerHTML = `
            <h3>${activity.title}</h3>
            <p>${activity.description}</p>
            <p>Date: ${activity.date}</p>
            <p>Location: ${activity.location}</p>
            <button class="update-btn" onclick="editActivity(${index})">Edit</button>
            <button class="delete-btn" onclick="deleteActivity(${index})">Delete</button>
        `;
        activitiesContainer.appendChild(activityCard);
    });
}

// Function to add an activity
document.getElementById('activityForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form submission
    const title = document.getElementById('activityTitle').value;
    const description = document.getElementById('activityDescription').value;
    const date = document.getElementById('activityDate').value;
    const location = document.getElementById('activityLocation').value;
    
    const newActivity = { title, description, date, location };
    activities.push(newActivity);
    saveActivities(); // Save to local storage
    renderActivities(); // Render activities
    event.target.reset(); // Reset the form
});

// Function to save activities to local storage
function saveActivities() {
    localStorage.setItem('activities', JSON.stringify(activities));
}

// Function to delete an activity
function deleteActivity(index) {
    activities.splice(index, 1); // Remove the activity from the array
    saveActivities(); // Save to local storage
    renderActivities(); // Re-render the activities
}

// Modal functionality
const editActivityModal = document.getElementById('editActivityModal');
const closeModalBtn = document.querySelector('.close');

// Open modal function
function openEditModal(activity) {
    document.getElementById('editActivityTitle').value = activity.title;
    document.getElementById('editActivityDescription').value = activity.description;
    document.getElementById('editActivityDate').value = activity.date;
    document.getElementById('editActivityLocation').value = activity.location;

    editActivityModal.style.display = 'block'; // Show the modal
}

// Close modal function
closeModalBtn.onclick = function() {
    editActivityModal.style.display = 'none';
}

// Close modal when clicking outside of the modal content
window.onclick = function(event) {
    if (event.target == editActivityModal) {
        editActivityModal.style.display = 'none';
    }
}

// Handle the form submission for editing
document.getElementById('editActivityForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('editActivityTitle').value;
    const description = document.getElementById('editActivityDescription').value;
    const date = document.getElementById('editActivityDate').value;
    const location = document.getElementById('editActivityLocation').value;

    const updateIndex = document.getElementById('editActivityForm').dataset.updateIndex;

    // Update the activity
    activities[updateIndex] = { title, description, date, location };

    renderActivities(); // Re-render the activities
    editActivityModal.style.display = 'none'; // Close the modal
    saveActivities(); // Save to local storage
});

// Modify the editActivity function to use the modal
function editActivity(index) {
    const activity = activities[index];
    document.getElementById('editActivityForm').dataset.updateIndex = index; // Save the index for later
    openEditModal(activity); // Open the modal with activity data
}

// Render activities on page load
renderActivities();

// Function to delete an activity
function deleteActivity(index) {
    // Show a confirmation dialog
    const confirmation = confirm('Are you sure you want to delete the activity?');
    
    if (confirmation) {
        activities.splice(index, 1); // Remove the activity from the array
        saveActivities(); // Save to local storage
        renderActivities(); // Re-render the activities
    }
}

