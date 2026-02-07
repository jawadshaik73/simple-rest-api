// API base URL - Using absolute URL if on localhost to handle different ports (like Live Server)
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api/users'
    : '/api/users';

// DOM Elements
const userForm = document.getElementById('userForm');
const usersContainer = document.getElementById('usersContainer');
const loadingIndicator = document.getElementById('loadingIndicator');
const emptyState = document.getElementById('emptyState');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const refreshBtn = document.getElementById('refreshBtn');
const apiStatus = document.getElementById('apiStatus');

// Form inputs
const userIdInput = document.getElementById('userId');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const ageInput = document.getElementById('age');
const occupationInput = document.getElementById('occupation');

// State to track if we're editing
let isEditing = false;

// Check API status on load
async function checkApiStatus() {
    try {
        const response = await fetch(API_BASE_URL);
        if (response.ok) {
            apiStatus.innerHTML = '<span class="material-symbols-outlined">check_circle</span> API Connected Successfully';
            apiStatus.className = 'status success';
        } else {
            throw new Error('API not responding');
        }
    } catch (error) {
        apiStatus.innerHTML = '<span class="material-symbols-outlined">error</span> API Connection Failed';
        apiStatus.className = 'status error';
        console.error('API Connection Error:', error);
    }
}

// Fetch all users from API
async function fetchUsers() {
    try {
        loadingIndicator.style.display = 'flex';
        usersContainer.innerHTML = '';
        emptyState.style.display = 'none';

        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const users = await response.json();

        loadingIndicator.style.display = 'none';

        if (users.length === 0) {
            emptyState.style.display = 'flex';
            return;
        }

        renderUsers(users);
    } catch (error) {
        loadingIndicator.style.display = 'none';
        console.error('Error fetching users:', error);

        // Show error in the users container
        usersContainer.innerHTML = `
      <div class="error-message">
        <span class="material-symbols-outlined">warning</span>
        <h3>Failed to Load Users</h3>
        <p>${error.message}</p>
      </div>
    `;
    }
}

// Render users to the DOM with animation delay
function renderUsers(users) {
    usersContainer.innerHTML = '';

    users.forEach((user, index) => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        // Add animation delay for staggered entrance
        userCard.style.animationDelay = `${index * 0.08}s`;

        userCard.innerHTML = `
      <div class="user-header">
        <div class="user-name">${user.name}</div>
        <div class="user-id">#${user.id}</div>
      </div>
      <div class="user-details">
        <div class="user-detail">
          <span class="material-symbols-outlined">mail</span>
          <span>${user.email}</span>
        </div>
        <div class="user-detail">
          <span class="material-symbols-outlined">cake</span>
          <span>Age: ${user.age || 'Not specified'}</span>
        </div>
        <div class="user-detail">
          <span class="material-symbols-outlined">work</span>
          <span>Occupation: ${user.occupation || 'Not specified'}</span>
        </div>
      </div>
      <div class="user-actions">
        <button class="btn btn-warning edit-btn" data-id="${user.id}">
          <span class="material-symbols-outlined">edit</span> Edit
        </button>
        <button class="btn btn-danger delete-btn" data-id="${user.id}">
          <span class="material-symbols-outlined">delete</span> Delete
        </button>
      </div>
    `;

        usersContainer.appendChild(userCard);
    });

    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.edit-btn').dataset.id;
            editUser(id);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.delete-btn').dataset.id;
            deleteUser(id);
        });
    });
}

// Create a new user
async function createUser(userData) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create user');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating user:', error);
        alert(`Error: ${error.message}`);
        throw error;
    }
}

// Update an existing user
async function updateUser(id, userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update user');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating user:', error);
        alert(`Error: ${error.message}`);
        throw error;
    }
}

// Delete a user
async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete user');
        }

        // Refresh the user list
        fetchUsers();
        showNotification('User deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting user:', error);
        alert(`Error: ${error.message}`);
    }
}

// Edit user - populate form with user data
async function editUser(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const user = await response.json();

        // Populate form with user data
        userIdInput.value = user.id;
        nameInput.value = user.name;
        emailInput.value = user.email;
        ageInput.value = user.age || '';
        occupationInput.value = user.occupation || '';

        // Change form to edit mode
        submitBtn.innerHTML = '<span class="material-symbols-outlined">save</span> Update User';
        submitBtn.className = 'btn btn-success';
        cancelBtn.style.display = 'flex';

        isEditing = true;

        // Scroll to form
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error fetching user for edit:', error);
        alert('Failed to load user data for editing');
    }
}

// Reset form to add mode
function resetForm() {
    userForm.reset();
    userIdInput.value = '';
    submitBtn.innerHTML = '<span class="material-symbols-outlined">add</span> Add User';
    submitBtn.className = 'btn btn-primary';
    cancelBtn.style.display = 'none';
    isEditing = false;
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
    <span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : 'info'}</span>
    <span>${message}</span>
  `;

    // Add to page
    document.body.appendChild(notification);

    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Event Listeners
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const userData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        age: ageInput.value ? parseInt(ageInput.value) : undefined,
        occupation: occupationInput.value.trim() || undefined
    };

    // Validate
    if (!userData.name || !userData.email) {
        alert('Name and email are required');
        return;
    }

    try {
        if (isEditing) {
            // Update existing user
            const id = userIdInput.value;
            await updateUser(id, userData);
            showNotification('User updated successfully', 'success');
        } else {
            // Create new user
            await createUser(userData);
            showNotification('User created successfully', 'success');
        }

        // Reset form and refresh user list
        resetForm();
        fetchUsers();
    } catch (error) {
        // Error is already handled in the create/update functions
    }
});

cancelBtn.addEventListener('click', resetForm);
refreshBtn.addEventListener('click', fetchUsers);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    checkApiStatus();
    fetchUsers();

    // Scroll to top functionality
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
