// Flashing page functionality
document.addEventListener("DOMContentLoaded", () => {
  checkAuth()
  loadUserWallets()
  loadCoinAvailability()
})

function checkAuth() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
  if (!user.username || !user.subscription) {
    window.location.href = "dashboard.html"
    return
  }

  // Check if subscription is still valid
  if (new Date(user.subscription.expiry) <= new Date()) {
    alert("Your subscription has expired. Please renew to continue flashing.")
    window.location.href = "dashboard.html"
    return
  }
}

function loadUserWallets() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
  const subscription = user.subscription

  if (!subscription) {
    window.location.href = "dashboard.html"
    return
  }

  const walletGrid = document.getElementById("walletGrid")
  const wallets = getWalletsForPlan(subscription.plan)

  walletGrid.innerHTML = ""

  if (wallets.length === 0) {
    walletGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #a1a1aa;">
        <i class="fas fa-wallet" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <h3>No wallets available</h3>
        <p>Please check your subscription plan</p>
      </div>
    `
    return
  }

  wallets.forEach((wallet) => {
    const walletCard = createWalletCard(wallet)
    walletGrid.appendChild(walletCard)
  })
}

function loadCoinAvailability() {
  fetch("/api/coin-availability")
    .then((response) => response.json())
    .then((data) => {
      window.coinAvailability = data
      updateCoinSelect()
    })
    .catch((error) => {
      console.error("Error loading coin availability:", error)
      window.coinAvailability = {}
    })
}

function updateCoinSelect() {
  const coinSelect = document.getElementById("coinSelect")
  if (!coinSelect) return

  const coins = [
    { value: "Bitcoin (BTC)", label: "Bitcoin (BTC)" },
    { value: "Ethereum (ETH)", label: "Ethereum (ETH)" },
    { value: "USDT", label: "USDT" },
    { value: "BNB", label: "BNB" },
    { value: "USDC", label: "USDC" },
    { value: "Dogecoin (DOGE)", label: "Dogecoin (DOGE)" },
    { value: "Cardano (ADA)", label: "Cardano (ADA)" },
    { value: "Solana (SOL)", label: "Solana (SOL)" },
  ]

  coinSelect.innerHTML = ""

  coins.forEach((coin) => {
    const option = document.createElement("option")
    option.value = coin.value

    const isAvailable = window.coinAvailability[coin.value] !== false
    if (isAvailable) {
      option.textContent = coin.label
    } else {
      option.textContent = `${coin.label} (Currently Unavailable)`
      option.disabled = true
      option.style.color = "#ef4444"
    }

    coinSelect.appendChild(option)
  })

  // Add change event listener to prevent selection of unavailable coins
  coinSelect.addEventListener("change", (e) => {
    const selectedCoin = e.target.value
    const isAvailable = window.coinAvailability[selectedCoin] !== false

    if (!isAvailable) {
      alert("Cannot select a coin that isn't available right now")
      e.target.selectedIndex = 0
    }
  })
}

function getWalletsForPlan(plan) {
  const walletPlans = {
    "1month": [
      {
        name: "Coinbase",
        image: "img/coinbase.png",
        className: "wallet-coinbase",
        tag: "ai",
      },
      {
        name: "Trust Wallet",
        image: "img/trustwallet.png",
        className: "wallet-trustwallet",
        tag: "ai",
        bulk: true,
      },
    ],
    "3months": [
      {
        name: "Coinbase",
        image: "img/coinbase.png",
        className: "wallet-coinbase",
        tag: "ai",
      },
      {
        name: "Trust Wallet",
        image: "img/trustwallet.png",
        className: "wallet-trustwallet",
        tag: "ai",
        bulk: true,
      },
      {
        name: "Atomic",
        image: "img/atomic.png",
        className: "wallet-atomic",
        tag: "ai",
      },
    ],
    "6months": [
      {
        name: "Trust Wallet",
        image: "img/trustwallet.png",
        className: "wallet-trustwallet",
        tag: "ai",
        bulk: true,
      },
      {
        name: "Coinbase",
        image: "img/coinbase.png",
        className: "wallet-coinbase",
        tag: "ai",
      },
      {
        name: "Atomic",
        image: "img/atomic.png",
        className: "wallet-atomic",
        tag: "ai",
      },
      {
        name: "Binance",
        image: "img/binance.png",
        className: "wallet-binance",
        tag: "hot",
        bulk: true,
      },
      {
        name: "OKX",
        image: "img/okx.png",
        className: "wallet-okx",
        tag: "ai",
      },
    ],
    "8months": [
      {
        name: "Trust Wallet",
        image: "img/trustwallet.png",
        className: "wallet-trustwallet",
        tag: "trending",
        bulk: true,
      },
      {
        name: "Coinbase",
        image: "img/coinbase.png",
        className: "wallet-coinbase",
        tag: "ai",
      },
      {
        name: "Atomic",
        image: "img/atomic.png",
        className: "wallet-atomic",
        tag: "ai",
      },
      {
        name: "Binance",
        image: "img/binance.png",
        className: "wallet-binance",
        tag: "hot",
        bulk: true,
      },
      {
        name: "OKX",
        image: "img/okx.png",
        className: "wallet-okx",
        tag: "ai",
      },
      {
        name: "Crypto.com",
        image: "img/crypto.png",
        className: "wallet-crypto",
        tag: "ai",
      },
      {
        name: "CoinEx",
        image: "img/coinex.png",
        className: "wallet-coinex",
        tag: "ai",
      },
      {
        name: "Blockchain",
        image: "img/blockchain.png",
        className: "wallet-blockchain",
        tag: "ai",
      },
      {
        name: "BTC",
        image: "img/btc.png",
        className: "wallet-btc",
        tag: "ai",
      },
      {
        name: "Exodus",
        image: "img/exodus.png",
        className: "wallet-exodus",
        tag: "ai",
      },
    ],
    "1year": [
      {
        name: "Trust Wallet",
        image: "img/trustwallet.png",
        className: "wallet-trustwallet",
        tag: "trending",
        bulk: true,
      },
      {
        name: "Coinbase",
        image: "img/coinbase.png",
        className: "wallet-coinbase",
        tag: "ai",
      },
      {
        name: "Atomic",
        image: "img/atomic.png",
        className: "wallet-atomic",
        tag: "ai",
      },
      {
        name: "Binance",
        image: "img/binance.png",
        className: "wallet-binance",
        tag: "hot",
        bulk: true,
      },
      {
        name: "OKX",
        image: "img/okx.png",
        className: "wallet-okx",
        tag: "ai",
      },
      {
        name: "Crypto.com",
        image: "img/crypto.png",
        className: "wallet-crypto",
        tag: "ai",
      },
      {
        name: "CoinEx",
        image: "img/coinex.png",
        className: "wallet-coinex",
        tag: "ai",
      },
      {
        name: "Blockchain",
        image: "img/blockchain.png",
        className: "wallet-blockchain",
        tag: "ai",
      },
      {
        name: "BTC",
        image: "img/btc.png",
        className: "wallet-btc",
        tag: "ai",
      },
      {
        name: "Exodus",
        image: "img/exodus.png",
        className: "wallet-exodus",
        tag: "ai",
      },
      {
        name: "SafePal",
        image: "img/safepal.png",
        className: "wallet-safepal",
        tag: "ai",
      },
      {
        name: "Token Pocket",
        image: "img/tokenpocket.png",
        className: "wallet-tokenpocket",
        tag: "ai",
      },
      {
        name: "MetaMask",
        image: "img/metamask.png",
        className: "wallet-metamask",
        tag: "new",
      },
    ],
  }

  return walletPlans[plan] || []
}

function createWalletCard(wallet) {
  const card = document.createElement("div")
  card.className = `wallet-card ${wallet.className}`
  card.onclick = () => openFlashModal(wallet)

  // Create tag element if wallet has a tag
  let tagHTML = ""
  if (wallet.tag) {
    const tagClass = `tag-${wallet.tag}`
    const tagText = wallet.tag.toUpperCase()
    tagHTML = `<div class="wallet-tag ${tagClass}">${tagText}</div>`
  }

  // Create bulk flashing button if wallet has bulk option
  let bulkHTML = ""
  if (wallet.bulk) {
    bulkHTML = `<div class="bulk-flashing">BULK FLASHING</div>`
  }

  card.innerHTML = `
        ${tagHTML}
        <div class="wallet-logo">
            <img src="${wallet.image}" alt="${wallet.name}" onerror="this.src='/placeholder.svg?height=60&width=60'">
        </div>
        <div class="wallet-name">${wallet.name}</div>
        ${bulkHTML}
    `

  return card
}

function openFlashModal(wallet) {
  document.getElementById("flashTitle").textContent = `Flash via ${wallet.name}`

  // Set wallet image
  const walletImage = document.getElementById("selectedWalletImage")
  walletImage.src = wallet.image
  walletImage.alt = wallet.name

  document.getElementById("flashModal").style.display = "block"

  // Store selected wallet for form submission
  window.selectedWallet = wallet
}

function handleFlash(event) {
  event.preventDefault()

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
  const selectedCoin = document.getElementById("coinSelect").value

  // Check if coin is available
  const isAvailable = window.coinAvailability[selectedCoin] !== false
  if (!isAvailable) {
    alert("Cannot select a coin that isn't available right now")
    return
  }

  const formData = {
    username: user.username,
    wallet: window.selectedWallet.name,
    coin: selectedCoin,
    quantity: document.getElementById("quantity").value,
    currency: document.getElementById("currency").value,
    amount: document.getElementById("amount").value,
    walletAddress: document.getElementById("walletAddress").value,
    flashType: document.getElementById("flashType").value,
    timestamp: new Date().toISOString(),
    flashId: generateFlashId(),
  }

  // Show initializing message
  showInitializingMessage()

  // Send flash request to server
  fetch("/api/flash-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        hideInitializingMessage()
        showPendingMessage(formData.flashId, formData.walletAddress)
        document.getElementById("flashModal").style.display = "none"
        document.getElementById("flashForm").reset()
      } else {
        hideInitializingMessage()
        alert("Error submitting flash request. Please try again.")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      hideInitializingMessage()
      alert("Error submitting flash request. Please try again.")
    })
}

function generateFlashId() {
  return "FLASH_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
}

function showInitializingMessage() {
  const initModal = document.createElement("div")
  initModal.id = "initializingModal"
  initModal.className = "modal"
  initModal.style.display = "block"
  initModal.innerHTML = `
        <div class="modal-content">
            <div style="text-align: center; padding: 2rem;">
                <div style="width: 60px; height: 60px; border: 4px solid #374151; border-top: 4px solid #2563eb; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <h3 style="color: #2563eb; margin-bottom: 1rem;">Initializing</h3>
                <p style="color: #a1a1aa;">Flashing process is in progress...</p>
            </div>
        </div>
    `
  document.body.appendChild(initModal)
}

function hideInitializingMessage() {
  const initModal = document.getElementById("initializingModal")
  if (initModal) {
    document.body.removeChild(initModal)
  }
}

function showPendingMessage(flashId, walletAddress) {
  // Create pending modal
  const pendingModal = document.createElement("div")
  pendingModal.className = "modal"
  pendingModal.style.display = "block"
  pendingModal.innerHTML = `
        <div class="modal-content">
            <div style="text-align: center; padding: 2rem;">
                <div style="width: 80px; height: 80px; background: linear-gradient(45deg, #f59e0b, #d97706); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 2rem; color: white;">
                    <i class="fas fa-clock"></i>
                </div>
                <h3 style="color: #f59e0b; margin-bottom: 1rem;">Flash Request Pending</h3>
                <p style="color: #a1a1aa; margin-bottom: 0.5rem;">Flash ID: <strong style="color: #2563eb;">${flashId}</strong></p>
                <p style="color: #a1a1aa; margin-bottom: 1rem;">Flashing to:</p>
                <p style="color: #60a5fa; font-weight: 600; margin-bottom: 1rem; word-break: break-all;">${walletAddress}</p>
                <p style="color: #a1a1aa;">Please be patient, we will notify you when flashing has been completed</p>
                <button onclick="this.closest('.modal').remove()" class="btn btn-primary" style="margin-top: 1.5rem; padding: 10px 20px;">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        </div>
    `

  document.body.appendChild(pendingModal)

  // Auto remove after 8 seconds
  setTimeout(() => {
    if (pendingModal.parentNode) {
      document.body.removeChild(pendingModal)
    }
  }, 8000)
}

function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
}

// Close modal functionality
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none"
  }
})

document.querySelectorAll(".close").forEach((closeBtn) => {
  closeBtn.onclick = function () {
    this.closest(".modal").style.display = "none"
  }
})
