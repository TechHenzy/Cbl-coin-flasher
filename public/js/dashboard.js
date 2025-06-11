// Dashboard specific JavaScript
document.addEventListener("DOMContentLoaded", () => {
  checkAuth()
  loadUserData()
  checkMessages()
  initializeNavigation()
})

// Update the welcome message to be shorter on small screens
function checkAuth() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
  if (!user.username) {
    window.location.href = "index.html"
    return
  }

  // Set username
  document.getElementById("username").textContent = user.username
  document.getElementById("accountUsername").textContent = user.username
  document.getElementById("accountEmail").textContent = user.email

  // Set welcome message with first name
  const firstName = user.fullName ? user.fullName.split(" ")[0] : user.username

  // Check screen width for responsive welcome message
  if (window.innerWidth <= 480) {
    document.getElementById("welcomeMessage").textContent = `Hi, ${firstName} 🤗`
  } else {
    document.getElementById("welcomeMessage").textContent = `Welcome back 🤗 ${firstName}`
  }

  // Load profile images
  loadProfileImages(user)
}

function loadProfileImages(user) {
  const navProfileImage = document.getElementById("navProfileImage")
  const navProfileIcon = document.getElementById("navProfileIcon")
  const dashProfileImage = document.getElementById("dashProfileImage")
  const dashProfileIcon = document.getElementById("dashProfileIcon")

  if (user.profilePicture) {
    // Show profile images
    navProfileImage.src = user.profilePicture
    navProfileImage.style.display = "block"
    navProfileIcon.style.display = "none"

    dashProfileImage.src = user.profilePicture
    dashProfileImage.style.display = "block"
    dashProfileIcon.style.display = "none"
  } else {
    // Show default icons
    navProfileImage.style.display = "none"
    navProfileIcon.style.display = "flex"

    dashProfileImage.style.display = "none"
    dashProfileIcon.style.display = "flex"
  }
}

function loadUserData() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}")

  // Update user status badge
  const userStatusElement = document.getElementById("userStatus")
  const statusBadge = userStatusElement.querySelector(".status-badge")

  if (user.subscription && new Date(user.subscription.expiry) > new Date()) {
    statusBadge.textContent = "Pro User"
    statusBadge.classList.add("pro")

    // Update subscription info
    document.getElementById("currentPlan").textContent = user.subscription.plan
    document.getElementById("planExpiry").textContent = new Date(user.subscription.expiry).toLocaleDateString()

    // Update wallet access
    document.getElementById("walletStatus").textContent = "Start Flashing"
    document.getElementById("walletBtn").textContent = "Start Flashing"
    document.getElementById("walletBtn").onclick = () => (window.location.href = "flashpage.html")
  } else {
    statusBadge.textContent = "Free User"
    statusBadge.classList.remove("pro")
  }
}

function checkMessages() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
  const messagesList = document.getElementById("messagesList")
  const messageCount = document.getElementById("messageCount")

  if (user.messages && user.messages.length > 0) {
    const unreadCount = user.messages.filter((msg) => !msg.read).length
    messageCount.textContent = unreadCount
    messageCount.style.display = unreadCount > 0 ? "inline" : "none"

    // Show latest message
    const latestMessage = user.messages[user.messages.length - 1]
    messagesList.innerHTML = `
      <div class="message-item ${!latestMessage.read ? "unread" : ""}" onclick="openMessage('${user.messages.length - 1}')">
        <div class="message-header">
          <div class="message-title">${latestMessage.title}</div>
          <div class="message-time">${new Date(latestMessage.timestamp).toLocaleDateString()}</div>
        </div>
        <div class="message-preview">${latestMessage.text.substring(0, 100)}...</div>
      </div>
    `

    // Auto show latest unread message
    if (!latestMessage.read) {
      setTimeout(() => showMessage(latestMessage), 1000)
    }
  } else {
    messageCount.style.display = "none"
    messagesList.innerHTML = "<p>No messages</p>"
  }
}

function showInboxModal() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
  const allMessagesList = document.getElementById("allMessagesList")

  if (user.messages && user.messages.length > 0) {
    allMessagesList.innerHTML = user.messages
      .map(
        (message, index) => `
      <div class="message-item ${!message.read ? "unread" : ""}" onclick="openMessage('${index}')">
        <div class="message-header">
          <div class="message-title">${message.title}</div>
          <div class="message-time">${new Date(message.timestamp).toLocaleDateString()}</div>
        </div>
        <div class="message-preview">${message.text.substring(0, 150)}...</div>
      </div>
    `,
      )
      .reverse()
      .join("")
  } else {
    allMessagesList.innerHTML = "<p style='text-align: center; color: #a1a1aa; padding: 2rem;'>No messages found</p>"
  }

  document.getElementById("inboxModal").style.display = "block"
}

function openMessage(messageIndex) {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
  const message = user.messages[messageIndex]

  if (!message) return

  // Mark as read
  message.read = true
  localStorage.setItem("currentUser", JSON.stringify(user))

  // Extract wallet address for copy button
  const walletAddressMatch = message.text.match(/([a-zA-Z0-9]{25,})/g)
  let messageContent = message.text

  if (walletAddressMatch) {
    walletAddressMatch.forEach((address) => {
      if (address.length >= 25) {
        messageContent = messageContent.replace(
          address,
          `${address} <button class="copy-address-btn" onclick="copyToClipboard('${address}')">
            <i class="fas fa-copy"></i> Copy
          </button>`,
        )
      }
    })
  }

  document.getElementById("messageDetailTitle").textContent = message.title
  document.getElementById("messageDetailContent").innerHTML = messageContent
  document.getElementById("messageDetailTime").textContent = `Received: ${new Date(message.timestamp).toLocaleString()}`

  document.getElementById("inboxModal").style.display = "none"
  document.getElementById("messageDetailModal").style.display = "block"

  // Update message count
  checkMessages()
}

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      // Show success feedback
      const btn = event.target.closest(".copy-address-btn")
      const originalText = btn.innerHTML
      btn.innerHTML = '<i class="fas fa-check"></i> Copied!'
      btn.style.background = "#10b981"

      setTimeout(() => {
        btn.innerHTML = originalText
        btn.style.background = "#10b981"
      }, 2000)
    })
    .catch(() => {
      alert("Failed to copy address")
    })
}

function closeMessageDetail() {
  document.getElementById("messageDetailModal").style.display = "none"
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
    if (navToggle && mobileMenu && !navToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
      navToggle.classList.remove("active")
      mobileMenu.classList.remove("active")
    }
  })
}

function toggleProfileMenu() {
  const dropdown = document.getElementById("profileDropdown")
  dropdown.classList.toggle("active")
}

// Close profile dropdown when clicking outside
document.addEventListener("click", (event) => {
  const profileSection = document.querySelector(".profile-section")
  const dropdown = document.getElementById("profileDropdown")

  if (profileSection && dropdown && !profileSection.contains(event.target)) {
    dropdown.classList.remove("active")
  }
})

function showMessage(message) {
  document.getElementById("messageTitle").textContent = message.title
  document.getElementById("messageText").textContent = message.text
  document.getElementById("messageModal").style.display = "block"

  let countdown = 5
  const countdownEl = document.getElementById("countdown")
  const timer = setInterval(() => {
    countdown--
    countdownEl.textContent = countdown
    if (countdown <= 0) {
      clearInterval(timer)
      closeMessage()
    }
  }, 1000)
}

function closeMessage() {
  document.getElementById("messageModal").style.display = "none"
  // Mark message as read
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
  if (user.messages && user.messages.length > 0) {
    user.messages[user.messages.length - 1].read = true
    localStorage.setItem("currentUser", JSON.stringify(user))
  }
  checkMessages()
}

function showSubscriptionModal() {
  document.getElementById("subscriptionModal").style.display = "block"
}

function showWallets(plan) {
  const walletList = document.getElementById(`wallets-${plan}`)
  if (walletList.style.display === "none") {
    walletList.style.display = "block"
  } else {
    walletList.style.display = "none"
  }
}

function subscribe(plan, price) {
  const whatsappNumber = "1234567890" // Replace with actual WhatsApp number
  const message = `Hi, I choose ${plan} plan to subscribe to your coin flasher for ₦${price.toLocaleString()}`
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, "_blank")

  // Show code input modal after WhatsApp redirect
  setTimeout(() => {
    document.getElementById("subscriptionModal").style.display = "none"
    document.getElementById("codeModal").style.display = "block"
  }, 2000)
}

function activateCode() {
  const code = document.getElementById("subscriptionCode").value

  if (!code) {
    alert("Please enter a subscription code")
    return
  }

  // Send code to server for verification
  fetch("/api/activate-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Update user subscription in localStorage
        const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
        user.subscription = data.subscription
        localStorage.setItem("currentUser", JSON.stringify(user))

        // Update user in server
        fetch("/api/update-user-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user.username,
            subscription: data.subscription,
            code: code,
          }),
        })

        alert("Subscription activated successfully!")
        document.getElementById("codeModal").style.display = "none"
        loadUserData()
      } else {
        alert("Invalid or expired code. Please try again.")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Error activating code. Please try again.")
    })
}

function checkWalletAccess() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
  if (user.subscription && new Date(user.subscription.expiry) > new Date()) {
    window.location.href = "flashpage.html"
  } else {
    showSubscriptionModal()
  }
}

function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
}

// Close modals when clicking outside
window.onclick = (event) => {
  const modals = document.querySelectorAll(".modal")
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none"
    }
  })
}

// Close modals when clicking close button
document.querySelectorAll(".close").forEach((closeBtn) => {
  closeBtn.onclick = function () {
    this.closest(".modal").style.display = "none"
  }
})

// Add resize event listener to adjust welcome message on screen resize
window.addEventListener("resize", () => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
  if (!user) return

  const firstName = user.fullName ? user.fullName.split(" ")[0] : user.username

  if (window.innerWidth <= 480) {
    document.getElementById("welcomeMessage").textContent = `Hi, ${firstName} 🤗`
  } else {
    document.getElementById("welcomeMessage").textContent = `Welcome back 🤗 ${firstName}`
  }
})
