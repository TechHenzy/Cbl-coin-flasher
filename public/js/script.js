// Main JavaScript functionality
document.addEventListener("DOMContentLoaded", () => {
  // Initialize scroll to top functionality
  initScrollToTop()

  // Check for user session
  checkUserSession()

  // Initialize typewriter effect
  initTypewriter()

  // Initialize counter animation
  initCounterAnimation()

  // Initialize navigation
  initNavigation()
})

function initScrollToTop() {
  const scrollTopBtn = document.querySelector(".scroll-top")

  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add("visible")
      } else {
        scrollTopBtn.classList.remove("visible")
      }
    })
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

function checkUserSession() {
  const currentUser = localStorage.getItem("currentUser")
  if (currentUser && window.location.pathname.includes("index.html")) {
    // User is logged in, redirect to dashboard
    window.location.href = "dashboard.html"
  }
}

function initTypewriter() {
  const typewriterElement = document.getElementById("typewriter")
  if (!typewriterElement) return

  const text = "CBL COIN FLASHER"
  let index = 0

  function typeWriter() {
    if (index < text.length) {
      typewriterElement.textContent += text.charAt(index)
      index++
      setTimeout(typeWriter, 150)
    }
  }

  typeWriter()
}

function initCounterAnimation() {
  const statCounter = document.getElementById("statCounter")
  if (!statCounter) return

  const target = 89800000 // 89.8M
  const duration = 3000 // 3 seconds
  const increment = target / (duration / 50)
  let current = 0

  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }

    // Format the number
    if (current >= 1000000) {
      statCounter.textContent = (current / 1000000).toFixed(1) + "M"
    } else if (current >= 1000) {
      statCounter.textContent = (current / 1000).toFixed(1) + "K"
    } else {
      statCounter.textContent = Math.floor(current).toString()
    }
  }, 50)
}

function initNavigation() {
  const navToggle = document.getElementById("navToggle")

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active")
      // Add mobile menu functionality here if needed
    })
  }
}

// Auth Modal Functions
function showAuthModal() {
  document.getElementById("authModal").style.display = "block"
  showLogin()
}

function showLoginModal() {
  document.getElementById("authModal").style.display = "block"
  showLogin()
}

function showLogin() {
  document.getElementById("loginForm").classList.add("active")
  document.getElementById("registerForm").classList.remove("active")
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))
  document.querySelectorAll(".tab-btn")[0].classList.add("active")
}

function showRegister() {
  document.getElementById("registerForm").classList.add("active")
  document.getElementById("loginForm").classList.remove("active")
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))
  document.querySelectorAll(".tab-btn")[1].classList.add("active")
}

function handleLogin(event) {
  event.preventDefault()

  const username = document.getElementById("loginUsername").value
  const password = document.getElementById("loginPassword").value

  // Send login request to server
  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Store user session
        localStorage.setItem("currentUser", JSON.stringify(data.user))

        // Redirect to dashboard
        window.location.href = "dashboard.html"
      } else {
        alert("Invalid username or password")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Login failed. Please try again.")
    })
}

function handleRegister(event) {
  event.preventDefault()

  const username = document.getElementById("regUsername").value
  const email = document.getElementById("regEmail").value
  const password = document.getElementById("regPassword").value

  // Basic validation
  if (username.length < 3) {
    alert("Username must be at least 3 characters long")
    return
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long")
    return
  }

  // Send registration request to server
  fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Registration successful! Please login.")
        showLogin()
      } else {
        alert(data.message || "Registration failed. Please try again.")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Registration failed. Please try again.")
    })
}

// Close modal when clicking outside
window.onclick = (event) => {
  const modal = document.getElementById("authModal")
  if (event.target === modal) {
    modal.style.display = "none"
  }
}

// Close modal when clicking close button
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("close")) {
    event.target.closest(".modal").style.display = "none"
  }
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Add loading animation utility
function showLoading() {
  const loading = document.createElement("div")
  loading.id = "loading"
  loading.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999;">
            <div style="width: 50px; height: 50px; border: 4px solid #374151; border-top: 4px solid #2563eb; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        </div>
    `
  document.body.appendChild(loading)
}

function hideLoading() {
  const loading = document.getElementById("loading")
  if (loading) {
    loading.remove()
  }
}

// Utility function to format currency
function formatCurrency(amount, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

// Utility function to format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Add notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `

  switch (type) {
    case "success":
      notification.style.background = "#10b981"
      break
    case "error":
      notification.style.background = "#ef4444"
      break
    case "warning":
      notification.style.background = "#f59e0b"
      break
    default:
      notification.style.background = "#2563eb"
  }

  notification.textContent = message
  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-in"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 5000)
}

// Add slide animations
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`
document.head.appendChild(style)
