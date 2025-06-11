// Admin panel functionality
let isLoggedIn = false

document.addEventListener("DOMContentLoaded", () => {
  checkAdminAuth()
})

function checkAdminAuth() {
  const adminAuth = localStorage.getItem("adminAuth")
  if (adminAuth === "true") {
    isLoggedIn = true
    document.getElementById("loginModal").style.display = "none"
    loadAdminData()
  }
}

function adminLogin(event) {
  event.preventDefault()

  const username = document.getElementById("adminUsername").value
  const password = document.getElementById("adminPassword").value

  // Check admin credentials
  if (username === "cblcoinflasheradmin" && password === "cblcoinflasher&$") {
    isLoggedIn = true
    localStorage.setItem("adminAuth", "true")
    document.getElementById("loginModal").style.display = "none"
    loadAdminData()
  } else {
    alert("Invalid admin credentials")
  }
}

function loadAdminData() {
  loadUsers()
  loadFlashRequests()
  loadCoinAvailability()
  loadAuthCodes()
}

function showTab(tabName) {
  // Hide all tabs
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active")
  })

  // Remove active class from all tab buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active")
  })

  // Show selected tab
  document.getElementById(tabName + "Tab").classList.add("active")
  event.target.classList.add("active")

  // Load data for the selected tab
  switch (tabName) {
    case "users":
      loadUsers()
      break
    case "flashing":
      loadFlashRequests()
      break
    case "coins":
      loadCoinAvailability()
      break
    case "codes":
      loadAuthCodes()
      break
  }
}

function loadUsers() {
  fetch("/api/admin/users")
    .then((response) => response.json())
    .then((users) => {
      const tbody = document.querySelector("#usersTable tbody")
      tbody.innerHTML = ""

      users.forEach((user) => {
        const row = document.createElement("tr")
        const planText = user.subscription ? user.subscription.plan : "No Plan"
        const statusBadge = user.isPro
          ? '<span class="status-badge status-active">Pro</span>'
          : '<span class="status-badge status-pending">Free</span>'

        row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${planText}</td>
                    <td>${statusBadge}</td>
                    <td>${user.subscription ? new Date(user.subscription.expiry).toLocaleDateString() : "N/A"}</td>
                    <td>
                        <button class="btn action-btn btn-danger" onclick="deleteUser('${user.username}')">Delete</button>
                    </td>
                `
        tbody.appendChild(row)
      })
    })
    .catch((error) => console.error("Error loading users:", error))
}

// Add this function to handle flash request details
function viewFlashDetails(flashId) {
  const flashRequests = JSON.parse(localStorage.getItem("flashRequests") || "[]")
  const request = flashRequests.find((r) => r.flashId === flashId)

  if (!request) return

  // Create modal for flash details
  const modal = document.createElement("div")
  modal.className = "modal"
  modal.style.display = "block"

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="this.parentNode.parentNode.remove()">&times;</span>
      <h3>Flash Request Details</h3>
      <div class="flash-details">
        <p><strong>Flash ID:</strong> ${request.flashId}</p>
        <p><strong>User:</strong> ${request.username}</p>
        <p><strong>Wallet:</strong> ${request.wallet}</p>
        <p><strong>Coin:</strong> ${request.coin}</p>
        <p><strong>Amount:</strong> ${request.amount} ${request.currency}</p>
        <p>
          <strong>Wallet Address:</strong> 
          <div class="address-detail">
            <span>${request.walletAddress}</span>
            <button class="btn action-btn btn-copy" onclick="copyWalletAddress('${request.walletAddress}')">
              <i class="fas fa-copy"></i> Copy
            </button>
          </div>
        </p>
        <p><strong>Status:</strong> <span class="status-badge status-${request.status}">${request.status}</span></p>
        <p><strong>Submitted:</strong> ${new Date(request.submittedAt).toLocaleString()}</p>
        ${request.completedAt ? `<p><strong>Completed:</strong> ${new Date(request.completedAt).toLocaleString()}</p>` : ""}
        ${request.failedAt ? `<p><strong>Failed:</strong> ${new Date(request.failedAt).toLocaleString()}</p>` : ""}
      </div>
      ${
        request.status === "pending"
          ? `
            <div class="modal-actions">
              <button class="btn btn-success" onclick="markAsDone('${request.flashId}'); this.parentNode.parentNode.parentNode.remove()">
                <i class="fas fa-check"></i> Mark as Done
              </button>
              <button class="btn btn-danger" onclick="markAsFailed('${request.flashId}'); this.parentNode.parentNode.parentNode.remove()">
                <i class="fas fa-times"></i> Mark as Failed
              </button>
            </div>
          `
          : ""
      }
    </div>
  `

  document.body.appendChild(modal)
}

// Modify the loadFlashRequests function to include click functionality
function loadFlashRequests() {
  fetch("/api/admin/flash-requests")
    .then((response) => response.json())
    .then((requests) => {
      // Store requests in localStorage for detail view
      localStorage.setItem("flashRequests", JSON.stringify(requests))

      const tbody = document.querySelector("#flashTable tbody")
      tbody.innerHTML = ""

      requests.forEach((request) => {
        const row = document.createElement("tr")
        row.innerHTML = `
                    <td>${request.flashId}</td>
                    <td>${request.username}</td>
                    <td>${request.wallet}</td>
                    <td>${request.coin}</td>
                    <td>${request.amount} ${request.currency}</td>
                    <td>
                      <div class="address-container">
                        <span title="${request.walletAddress}" class="wallet-address" onclick="viewFlashDetails('${request.flashId}')">${request.walletAddress.substring(0, 15)}...</span>
                        <button class="btn action-btn btn-copy" onclick="copyWalletAddress('${request.walletAddress}')">
                          <i class="fas fa-copy"></i>
                        </button>
                      </div>
                    </td>
                    <td><span class="status-badge status-${request.status}">${request.status}</span></td>
                    <td>
                        ${
                          request.status === "pending"
                            ? `
                              <button class="btn action-btn btn-success" onclick="markAsDone('${request.flashId}')">Done</button>
                              <button class="btn action-btn btn-danger" onclick="markAsFailed('${request.flashId}')">Failed</button>
                            `
                            : request.status === "completed"
                              ? '<span style="color: #10b981;">Completed</span>'
                              : '<span style="color: #ef4444;">Failed</span>'
                        }
                    </td>
                `
        tbody.appendChild(row)
      })
    })
    .catch((error) => console.error("Error loading flash requests:", error))
}

function copyWalletAddress(address) {
  navigator.clipboard
    .writeText(address)
    .then(() => {
      // Show success feedback
      showNotification("Address copied to clipboard!", "success")
    })
    .catch(() => {
      showNotification("Failed to copy address", "error")
    })
}

// Add this notification function
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `admin-notification admin-notification-${type}`
  notification.textContent = message

  document.body.appendChild(notification)

  // Auto remove after 2 seconds
  setTimeout(() => {
    notification.classList.add("fade-out")
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 2000)
}

function loadCoinAvailability() {
  fetch("/api/admin/coin-availability")
    .then((response) => response.json())
    .then((coinStatus) => {
      const coins = [
        "Bitcoin (BTC)",
        "Ethereum (ETH)",
        "USDT",
        "BNB",
        "USDC",
        "Dogecoin (DOGE)",
        "Cardano (ADA)",
        "Solana (SOL)",
      ]

      coins.forEach((coin) => {
        const isAvailable = coinStatus[coin] !== false
        updateCoinStatusButtons(coin, isAvailable)
      })
    })
    .catch((error) => console.error("Error loading coin availability:", error))
}

function updateCoinStatusButtons(coin, isAvailable) {
  const coinCards = document.querySelectorAll(".coin-card")

  coinCards.forEach((card) => {
    const coinName = card.querySelector("h3").textContent
    if (coinName === coin) {
      const availableBtn = card.querySelector(".status-btn.available")
      const unavailableBtn = card.querySelector(".status-btn.unavailable")

      if (isAvailable) {
        availableBtn.classList.add("active")
        unavailableBtn.classList.remove("active")
      } else {
        availableBtn.classList.remove("active")
        unavailableBtn.classList.add("active")
      }
    }
  })
}

function setCoinStatus(coin, isAvailable) {
  fetch("/api/admin/set-coin-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ coin, isAvailable }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        updateCoinStatusButtons(coin, isAvailable)
        alert(`${coin} status updated to ${isAvailable ? "Available" : "Unavailable"}`)
      } else {
        alert("Error updating coin status")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Error updating coin status")
    })
}

function loadAuthCodes() {
  fetch("/api/admin/auth-codes")
    .then((response) => response.json())
    .then((data) => {
      const { codes, stats } = data

      // Update stats
      document.getElementById("totalCodes").textContent = stats.total
      document.getElementById("usedCodes").textContent = stats.used
      document.getElementById("availableCodes").textContent = stats.available

      // Update table
      const tbody = document.querySelector("#codesTable tbody")
      tbody.innerHTML = ""

      codes.forEach((code) => {
        const row = document.createElement("tr")
        row.innerHTML = `
                    <td>${code.code}</td>
                    <td>${code.plan}</td>
                    <td><span class="status-badge status-${code.status}">${code.status}</span></td>
                    <td>${code.usedBy || "N/A"}</td>
                    <td>${code.dateUsed ? new Date(code.dateUsed).toLocaleDateString() : "N/A"}</td>
                `
        tbody.appendChild(row)
      })
    })
    .catch((error) => console.error("Error loading auth codes:", error))
}

function deleteUser(username) {
  if (confirm(`Are you sure you want to delete user: ${username}?`)) {
    fetch("/api/admin/delete-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("User deleted successfully")
          loadUsers()
        } else {
          alert("Error deleting user")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("Error deleting user")
      })
  }
}

function markAsDone(flashId) {
  fetch("/api/admin/mark-done", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ flashId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Flash request marked as done")
        loadFlashRequests()
      } else {
        alert("Error marking flash request as done")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Error marking flash request as done")
    })
}

function markAsFailed(flashId) {
  fetch("/api/admin/mark-failed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ flashId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Flash request marked as failed")
        loadFlashRequests()
      } else {
        alert("Error marking flash request as failed")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Error marking flash request as failed")
    })
}

function generateCodes() {
  const count = prompt("How many codes to generate for each plan?", "10")
  if (count && !isNaN(count)) {
    fetch("/api/admin/generate-codes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ count: Number.parseInt(count) }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(`Generated ${data.generated} new codes`)
          loadAuthCodes()
        } else {
          alert("Error generating codes")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("Error generating codes")
      })
  }
}

function exportCodes() {
  fetch("/api/admin/export-codes")
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = "auth-codes.json"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Error exporting codes")
    })
}

function logout() {
  localStorage.removeItem("adminAuth")
  window.location.reload()
}
