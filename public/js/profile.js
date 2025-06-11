// Profile page specific JavaScript
document.addEventListener("DOMContentLoaded", () => {
  checkAuth()
  loadProfileData()
  initializeNavigation()
  initializeProfilePicture()
})

function checkAuth() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
  if (!user.username) {
    window.location.href = "index.html"
    return
  }
  document.getElementById("username").textContent = user.username
}

function loadProfileData() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}")

  // Load basic info
  document.getElementById("profileUsername").value = user.username
  document.getElementById("profileEmail").value = user.email
  document.getElementById("profileFullName").value = user.fullName || ""
  document.getElementById("profilePhone").value = user.phone || ""

  // Load profile picture
  if (user.profilePicture) {
    document.getElementById("profileImage").src = user.profilePicture
  }

  // Update user status badge
  const userStatusElement = document.getElementById("userStatus")
  const statusBadge = userStatusElement.querySelector(".status-badge")

  if (user.subscription && new Date(user.subscription.expiry) > new Date()) {
    statusBadge.textContent = "Pro User"
    statusBadge.classList.add("pro")

    // Update subscription info
    document.getElementById("currentPlan").textContent = user.subscription.plan
    document.getElementById("planExpiry").textContent = new Date(user.subscription.expiry).toLocaleDateString()
    document.getElementById("subscriptionStatus").textContent = "Active"
    document.getElementById("subscriptionStatus").style.color = "#10b981"

    // Calculate days remaining
    const daysRemaining = Math.ceil((new Date(user.subscription.expiry) - new Date()) / (1000 * 60 * 60 * 24))
    document.getElementById("daysRemaining").textContent = daysRemaining > 0 ? `${daysRemaining} days` : "Expired"
  } else {
    statusBadge.textContent = "Free User"
    statusBadge.classList.remove("pro")
    document.getElementById("subscriptionStatus").textContent = "Inactive"
    document.getElementById("subscriptionStatus").style.color = "#ef4444"
  }
}

function initializeNavigation() {
  // Mobile menu toggle
  const navToggle = document.getElementById("navToggle")
  const mobileMenu = document.getElementById("mobileMenu")

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active")
      mobileMenu.classList.toggle("active")
    })
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", (event) => {
    if (!navToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
      navToggle.classList.remove("active")
      mobileMenu.classList.remove("active")
    }
  })
}

function toggleProfileMenu() {
  const dropdown = document.getElementById("profileDropdown")
  dropdown.classList.toggle("active")
}

function initializeProfilePicture() {
  const profileImageInput = document.getElementById("profileImageInput")

  profileImageInput.addEventListener("change", (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        document.getElementById("profileImage").src = e.target.result

        // Save to localStorage
        const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
        user.profilePicture = e.target.result
        localStorage.setItem("currentUser", JSON.stringify(user))

        // Update on server
        updateUserProfile({ profilePicture: e.target.result })
      }
      reader.readAsDataURL(file)
    }
  })
}

function removeProfilePicture() {
  document.getElementById("profileImage").src = "/placeholder.svg?height=120&width=120"

  // Remove from localStorage
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
  delete user.profilePicture
  localStorage.setItem("currentUser", JSON.stringify(user))

  // Update on server
  updateUserProfile({ profilePicture: null })
}

function updateProfile(event) {
  event.preventDefault()

  const email = document.getElementById("profileEmail").value
  const fullName = document.getElementById("profileFullName").value
  const phone = document.getElementById("profilePhone").value

  // Update localStorage
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
  user.email = email
  user.fullName = fullName
  user.phone = phone
  localStorage.setItem("currentUser", JSON.stringify(user))

  // Update on server
  updateUserProfile({ email, fullName, phone })

  alert("Profile updated successfully!")
}

function updateUserProfile(updates) {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}")

  fetch("/api/update-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: user.username,
      updates: updates,
    }),
  }).catch((error) => {
    console.error("Error updating profile:", error)
  })
}

function changePassword(event) {
  event.preventDefault()

  const currentPassword = document.getElementById("currentPassword").value
  const newPassword = document.getElementById("newPassword").value
  const confirmPassword = document.getElementById("confirmPassword").value

  if (newPassword !== confirmPassword) {
    alert("New passwords do not match!")
    return
  }

  if (newPassword.length < 6) {
    alert("New password must be at least 6 characters long!")
    return
  }

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}")

  fetch("/api/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: user.username,
      currentPassword: currentPassword,
      newPassword: newPassword,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Password changed successfully!")
        document.getElementById("passwordForm").reset()
      } else {
        alert(data.message || "Error changing password")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Error changing password. Please try again.")
    })
}

function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
}

// Close profile dropdown when clicking outside
document.addEventListener("click", (event) => {
  const profileSection = document.querySelector(".profile-section")
  const dropdown = document.getElementById("profileDropdown")

  if (profileSection && dropdown && !profileSection.contains(event.target)) {
    dropdown.classList.remove("active")
  }
})
