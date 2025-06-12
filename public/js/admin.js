// Admin panel functionality
let isLoggedIn = false
let currentSelectedWallet = null

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
  loadWalletAvailability()
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
    case "wallets":
      loadWalletAvailability()
      break
    case "wallet-coins":
      // Reset wallet coins tab
      document.getElementById("walletSelect").value = ""
      document.getElementById("walletCoinsContainer").style.display = "none"
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

        // Create address cell with copy button
        let addressCell = `
          <div class="address-container">
            <span title="${request.walletAddress}" class="wallet-address" onclick="viewFlashDetails('${request.flashId}')">${request.walletAddress.substring(0, 15)}...</span>
            <button class="btn action-btn btn-copy" onclick="copyWalletAddress('${request.walletAddress}')">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        `

        // Add RPC URL if available
        if (request.rpcUrl) {
          addressCell += `
            <div class="rpc-container" style="margin-top: 5px;">
              <small style="color: #a1a1aa;">RPC: </small>
              <span title="${request.rpcUrl}" class="rpc-url" style="color: #60a5fa; font-size: 0.8rem;">${request.rpcUrl.substring(0, 20)}...</span>
              <button class="btn action-btn btn-copy" onclick="copyWalletAddress('${request.rpcUrl}')" style="margin-left: 4px; padding: 2px 4px; font-size: 0.7rem;">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          `
        }

        row.innerHTML = `
                    <td>${request.flashId}</td>
                    <td>${request.username}</td>
                    <td>${request.wallet}</td>
                    <td>${request.coin}</td>
                    <td>${request.amount} ${request.currency}</td>
                    <td>${addressCell}</td>
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

function loadWalletAvailability() {
  fetch("/api/admin/wallet-availability")
    .then((response) => response.json())
    .then((walletStatus) => {
      const wallets = [
        "Coinbase",
        "Trust Wallet",
        "Atomic",
        "Binance",
        "OKX",
        "Crypto.com",
        "CoinEx",
        "Blockchain",
        "BTC",
        "Exodus",
        "SafePal",
        "Token Pocket",
        "MetaMask",
      ]

      wallets.forEach((wallet) => {
        const isAvailable = walletStatus[wallet] !== false
        updateWalletStatusButtons(wallet, isAvailable)
      })
    })
    .catch((error) => console.error("Error loading wallet availability:", error))
}

function updateWalletStatusButtons(wallet, isAvailable) {
  const walletCards = document.querySelectorAll(".wallet-management-card")

  walletCards.forEach((card) => {
    const walletNameElement = card.querySelector("h3")
    const walletName = walletNameElement.textContent

    if (walletName === wallet) {
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

function setWalletStatus(wallet, isAvailable) {
  fetch("/api/admin/set-wallet-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ wallet, isAvailable }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        updateWalletStatusButtons(wallet, isAvailable)
        showNotification(`${wallet} status updated to ${isAvailable ? "Available" : "Unavailable"}`, "success")
      } else {
        showNotification("Error updating wallet status", "error")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showNotification("Error updating wallet status", "error")
    })
}

function loadWalletCoins() {
  const selectedWallet = document.getElementById("walletSelect").value

  if (!selectedWallet) {
    document.getElementById("walletCoinsContainer").style.display = "none"
    return
  }

  currentSelectedWallet = selectedWallet
  document.getElementById("selectedWalletTitle").textContent = `Coin Availability for ${selectedWallet}`
  document.getElementById("walletCoinsContainer").style.display = "block"

  fetch("/api/admin/wallet-coin-availability")
    .then((response) => response.json())
    .then((walletCoins) => {
      const walletCoinData = walletCoins[selectedWallet] || {}
      const coinsGrid = document.getElementById("walletCoinsGrid")

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

      coinsGrid.innerHTML = ""

      coins.forEach((coin) => {
        const isAvailable = walletCoinData[coin] !== false
        const coinCard = document.createElement("div")
        coinCard.className = "coin-card"

        coinCard.innerHTML = `
          <div class="coin-header">
            <h3>${coin}</h3>
          </div>
          <div class="coin-status">
            <button class="status-btn available ${isAvailable ? "active" : ""}" onclick="setWalletCoinStatus('${selectedWallet}', '${coin}', true)">Available</button>
            <button class="status-btn unavailable ${!isAvailable ? "active" : ""}" onclick="setWalletCoinStatus('${selectedWallet}', '${coin}', false)">Unavailable</button>
          </div>
        `

        coinsGrid.appendChild(coinCard)
      })
    })
    .catch((error) => console.error("Error loading wallet coins:", error))
}

function setWalletCoinStatus(wallet, coin, isAvailable) {
  fetch("/api/admin/set-wallet-coin-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ wallet, coin, isAvailable }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Reload the wallet coins to update the UI
        loadWalletCoins()
        showNotification(`${coin} for ${wallet} updated to ${isAvailable ? "Available" : "Unavailable"}`, "success")
      } else {
        showNotification("Error updating coin status", "error")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showNotification("Error updating coin status", "error")
    })
}

function viewFlashDetails(flashId) {
  const flashRequests = JSON.parse(localStorage.getItem("flashRequests") || "[]")
  const request = flashRequests.find((r) => r.flashId === flashId)

  if (!request) return

  let detailsHTML = `
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
  `

  // Add RPC URL if available
  if (request.rpcUrl) {
    detailsHTML += `
      <p>
        <strong>RPC URL:</strong> 
        <div class="address-detail">
          <span>${request.rpcUrl}</span>
          <button class="btn action-btn btn-copy" onclick="copyWalletAddress('${request.rpcUrl}')">
            <i class="fas fa-copy"></i> Copy
          </button>
        </div>
      </p>
    `
  }

  // Add extended fields if available
  if (request.networkName) {
    detailsHTML += `<p><strong>Network Name:</strong> ${request.networkName}</p>`
  }
  if (request.chainId) {
    detailsHTML += `<p><strong>Chain ID:</strong> ${request.chainId}</p>`
  }
  if (request.currencySymbol) {
    detailsHTML += `<p><strong>Currency Symbol:</strong> ${request.currencySymbol}</p>`
  }
  if (request.blockExplorerUrl) {
    detailsHTML += `
      <p>
        <strong>Block Explorer URL:</strong> 
        <div class="address-detail">
          <span>${request.blockExplorerUrl}</span>
          <button class="btn action-btn btn-copy" onclick="copyWalletAddress('${request.blockExplorerUrl}')">
            <i class="fas fa-copy"></i> Copy
          </button>
        </div>
      </p>
    `
  }

  detailsHTML += `
    <p><strong>Status:</strong> <span class="status-badge status-${request.status}">${request.status}</span></p>
    <p><strong>Submitted:</strong> ${new Date(request.submittedAt).toLocaleString()}</p>
    ${request.completedAt ? `<p><strong>Completed:</strong> ${new Date(request.completedAt).toLocaleString()}</p>` : ""}
    ${request.failedAt ? `<p><strong>Failed:</strong> ${new Date(request.failedAt).toLocaleString()}</p>` : ""}
  `

  // Create modal for flash details
  const modal = document.createElement("div")
  modal.className = "modal"
  modal.style.display = "block"

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="this.parentNode.parentNode.remove()">&times;</span>
      <h3>Flash Request Details</h3>
      <div class="flash-details">
        ${detailsHTML}
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

function copyWalletAddress(address) {
  navigator.clipboard
    .writeText(address)
    .then(() => {
      showNotification("Address copied to clipboard!", "success")
    })
    .catch(() => {
      showNotification("Failed to copy address", "error")
    })
}

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
          showNotification("User deleted successfully", "success")
          loadUsers()
        } else {
          showNotification("Error deleting user", "error")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        showNotification("Error deleting user", "error")
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
        showNotification("Flash request marked as done", "success")
        loadFlashRequests()
      } else {
        showNotification("Error marking flash request as done", "error")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showNotification("Error marking flash request as done", "error")
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
        showNotification("Flash request marked as failed", "success")
        loadFlashRequests()
      } else {
        showNotification("Error marking flash request as failed", "error")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showNotification("Error marking flash request as failed", "error")
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
          showNotification(`Generated ${data.generated} new codes`, "success")
          loadAuthCodes()
        } else {
          showNotification("Error generating codes", "error")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        showNotification("Error generating codes", "error")
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
      showNotification("Error exporting codes", "error")
    })
}

function logout() {
  localStorage.removeItem("adminAuth")
  window.location.reload()
}

function editWalletName(currentName) {
  const newName = prompt(`Edit wallet name:`, currentName)

  if (newName && newName !== currentName && newName.trim() !== "") {
    // Update the wallet name in the UI
    const walletCards = document.querySelectorAll(".wallet-management-card")

    walletCards.forEach((card) => {
      const walletNameElement = card.querySelector("h3")
      if (walletNameElement.textContent === currentName) {
        walletNameElement.textContent = newName.trim()

        // Update the onclick handlers
        const availableBtn = card.querySelector(".status-btn.available")
        const unavailableBtn = card.querySelector(".status-btn.unavailable")
        const editBtn = card.querySelector(".btn-edit")

        availableBtn.setAttribute("onclick", `setWalletStatus('${newName.trim()}', true)`)
        unavailableBtn.setAttribute("onclick", `setWalletStatus('${newName.trim()}', false)`)
        editBtn.setAttribute("onclick", `editWalletName('${newName.trim()}')`)
      }
    })

    showNotification(`Wallet name updated to "${newName.trim()}"`, "success")
  }
}
