const express = require("express")
const fs = require("fs").promises
const path = require("path")
const crypto = require("crypto")

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.static("public"))

// Data file paths
const USERS_FILE = path.join(__dirname, "data", "users.json")
const AUTHS_FILE = path.join(__dirname, "data", "auths.json")
const FLASH_REQUESTS_FILE = path.join(__dirname, "data", "flash-requests.json")
const WALLET_AVAILABILITY_FILE = path.join(__dirname, "data", "wallet-availability.json")
const WALLET_COIN_AVAILABILITY_FILE = path.join(__dirname, "data", "wallet-coin-availability.json")

// Initialize data files if they don't exist
async function initializeDataFiles() {
  try {
    // Create data directory if it doesn't exist
    await fs.mkdir("data", { recursive: true })

    // Initialize users.json
    try {
      await fs.access(USERS_FILE)
    } catch {
      await fs.writeFile(USERS_FILE, JSON.stringify([]))
    }

    // Initialize flash-requests.json
    try {
      await fs.access(FLASH_REQUESTS_FILE)
    } catch {
      await fs.writeFile(FLASH_REQUESTS_FILE, JSON.stringify([]))
    }

    // Initialize wallet-availability.json
    try {
      await fs.access(WALLET_AVAILABILITY_FILE)
    } catch {
      const initialWalletStatus = {
        Coinbase: true,
        "Trust Wallet": true,
        Atomic: true,
        Binance: true,
        OKX: true,
        "Crypto.com": true,
        CoinEx: true,
        Blockchain: true,
        BTC: true,
        Exodus: true,
        SafePal: true,
        "Token Pocket": true,
        MetaMask: true,
      }
      await fs.writeFile(WALLET_AVAILABILITY_FILE, JSON.stringify(initialWalletStatus, null, 2))
    }

    // Initialize wallet-coin-availability.json
    try {
      await fs.access(WALLET_COIN_AVAILABILITY_FILE)
    } catch {
      const initialWalletCoinStatus = {
        Coinbase: {
          "Bitcoin (BTC)": true,
          "Ethereum (ETH)": true,
          USDT: true,
          BNB: false,
          USDC: true,
          "Dogecoin (DOGE)": true,
          "Cardano (ADA)": false,
          "Solana (SOL)": true,
        },
        "Trust Wallet": {
          "Bitcoin (BTC)": true,
          "Ethereum (ETH)": true,
          USDT: false,
          BNB: true,
          USDC: true,
          "Dogecoin (DOGE)": true,
          "Cardano (ADA)": true,
          "Solana (SOL)": true,
        },
        Atomic: {
          "Bitcoin (BTC)": true,
          "Ethereum (ETH)": true,
          USDT: true,
          BNB: true,
          USDC: false,
          "Dogecoin (DOGE)": true,
          "Cardano (ADA)": true,
          "Solana (SOL)": false,
          "BSC NETWORK": true,
          "TRX NETWORK": true,
          "BEP20 NETWORK": true,
          "ERC20 NETWORK": true,
        },
        Binance: {
          "Bitcoin (BTC)": true,
          "Ethereum (ETH)": true,
          USDT: true,
          BNB: true,
          USDC: true,
          "Dogecoin (DOGE)": true,
          "Cardano (ADA)": true,
          "Solana (SOL)": true,
        },
        OKX: {
          "Bitcoin (BTC)": true,
          "Ethereum (ETH)": true,
          USDT: true,
          BNB: false,
          USDC: true,
          "Dogecoin (DOGE)": false,
          "Cardano (ADA)": true,
          "Solana (SOL)": true,
        },
        "Crypto.com": {
          "Bitcoin (BTC)": true,
          "Ethereum (ETH)": true,
          USDT: true,
          BNB: true,
          USDC: true,
          "Dogecoin (DOGE)": true,
          "Cardano (ADA)": false,
          "Solana (SOL)": true,
        },
        CoinEx: {
          "Bitcoin (BTC)": true,
          "Ethereum (ETH)": false,
          USDT: true,
          BNB: true,
          USDC: false,
          "Dogecoin (DOGE)": true,
          "Cardano (ADA)": true,
          "Solana (SOL)": true,
        },
        Blockchain: {
          "Bitcoin (BTC)": true,
          "Ethereum (ETH)": true,
          USDT: false,
          BNB: false,
          USDC: true,
          "Dogecoin (DOGE)": true,
          "Cardano (ADA)": true,
          "Solana (SOL)": false,
        },
        BTC: {
          "Bitcoin (BTC)": true,
          "Ethereum (ETH)": false,
          USDT: false,
          BNB: false,
          USDC: false,
          "Dogecoin (DOGE)": false,
          "Cardano (ADA)": false,
          "Solana (SOL)": false,
        },
        Exodus: {
          "Bitcoin (BTC)": true,
          "Ethereum (ETH)": true,
          USDT: true,
          BNB: false,
          USDC: true,
          "Dogecoin (DOGE)": true,
          "Cardano (ADA)": true,
          "Solana (SOL)": true,
        },
        SafePal: {
          "Bitcoin (BTC)": true,
          "Ethereum (ETH)": true,
          USDT: true,
          BNB: true,
          USDC: true,
          "Dogecoin (DOGE)": false,
          "Cardano (ADA)": true,
          "Solana (SOL)": true,
        },
        "Token Pocket": {
          "Bitcoin (BTC)": true,
          "Ethereum (ETH)": true,
          USDT: false,
          BNB: true,
          USDC: false,
          "Dogecoin (DOGE)": true,
          "Cardano (ADA)": true,
          "Solana (SOL)": true,
        },
        MetaMask: {
          "Bitcoin (BTC)": false,
          "Ethereum (ETH)": true,
          USDT: true,
          BNB: false,
          USDC: true,
          "Dogecoin (DOGE)": false,
          "Cardano (ADA)": false,
          "Solana (SOL)": false,
          "BSC NETWORK": true,
          "TRX NETWORK": true,
          "BEP20 NETWORK": true,
          "ERC20 NETWORK": true,
        },
      }
      await fs.writeFile(WALLET_COIN_AVAILABILITY_FILE, JSON.stringify(initialWalletCoinStatus, null, 2))
    }

    // Initialize auths.json with sample codes
    try {
      await fs.access(AUTHS_FILE)
    } catch {
      const initialCodes = generateInitialCodes()
      await fs.writeFile(AUTHS_FILE, JSON.stringify(initialCodes, null, 2))
    }

    // Initialize wallet-configurations.json
    try {
      await fs.access(path.join(__dirname, "data", "wallet-configurations.json"))
    } catch {
      const initialWalletConfigurations = {
        "Token Pocket": {
          rpcUrl: "https://bsc-dataseed.binance.org/",
        },
        "Crypto.com": {
          rpcUrl: "https://evm.cronos.org",
        },
        MetaMask: {
          networks: {
            "BSC NETWORK": {
              networkName: "Binance Smart Chain",
              rpcUrl: "https://bsc-dataseed1.binance.org",
              chainId: "56",
              currencySymbol: "BNB",
              blockExplorerUrl: "https://bscscan.com",
            },
            "TRX NETWORK": {
              networkName: "TRON Network",
              rpcUrl: "https://api.trongrid.io",
              chainId: "728126428",
              currencySymbol: "TRX",
              blockExplorerUrl: "https://tronscan.org",
            },
            "BEP20 NETWORK": {
              networkName: "Binance Smart Chain (BEP20)",
              rpcUrl: "https://bsc-dataseed.binance.org/",
              chainId: "56",
              currencySymbol: "BNB",
              blockExplorerUrl: "https://bscscan.com",
            },
            "ERC20 NETWORK": {
              networkName: "Ethereum Mainnet",
              rpcUrl: "https://mainnet.infura.io/v3/your-api-key",
              chainId: "1",
              currencySymbol: "ETH",
              blockExplorerUrl: "https://etherscan.io",
            },
          },
        },
        Atomic: {
          networks: {
            "BSC NETWORK": {
              networkName: "Binance Smart Chain",
              rpcUrl: "https://bsc-dataseed1.binance.org",
              chainId: "56",
              currencySymbol: "BNB",
              blockExplorerUrl: "https://bscscan.com",
            },
            "TRX NETWORK": {
              networkName: "TRON Network",
              rpcUrl: "https://api.trongrid.io",
              chainId: "728126428",
              currencySymbol: "TRX",
              blockExplorerUrl: "https://tronscan.org",
            },
            "BEP20 NETWORK": {
              networkName: "Binance Smart Chain (BEP20)",
              rpcUrl: "https://bsc-dataseed.binance.org/",
              chainId: "56",
              currencySymbol: "BNB",
              blockExplorerUrl: "https://bscscan.com",
            },
            "ERC20 NETWORK": {
              networkName: "Ethereum Mainnet",
              rpcUrl: "https://mainnet.infura.io/v3/your-api-key",
              chainId: "1",
              currencySymbol: "ETH",
              blockExplorerUrl: "https://etherscan.io",
            },
          },
        },
      }
      await writeJsonFile(path.join(__dirname, "data", "wallet-configurations.json"), initialWalletConfigurations)
    }

    console.log("Data files initialized successfully")
  } catch (error) {
    console.error("Error initializing data files:", error)
  }
}

// Generate initial authentication codes
function generateInitialCodes() {
  const codes = []
  const plans = ["1month", "3months", "6months", "8months", "1year"]
  const codesPerPlan = 40 // 200 total codes / 5 plans = 40 codes per plan

  plans.forEach((plan) => {
    for (let i = 0; i < codesPerPlan; i++) {
      codes.push({
        code: generateCode(),
        plan: plan,
        status: "available",
        usedBy: null,
        dateUsed: null,
      })
    }
  })

  return codes
}

// Generate a random code
function generateCode() {
  return crypto.randomBytes(8).toString("hex").toUpperCase()
}

// Helper functions for file operations
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error)
    return []
  }
}

async function writeJsonFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error)
    return false
  }
}

// API Routes

// User Registration
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Validation
    if (!username || !email || !password) {
      return res.json({ success: false, message: "All fields are required" })
    }

    const users = await readJsonFile(USERS_FILE)

    // Check if user already exists
    const existingUser = users.find((u) => u.username === username || u.email === email)
    if (existingUser) {
      return res.json({ success: false, message: "Username or email already exists" })
    }

    // Create new user
    const newUser = {
      username,
      email,
      password, // In production, this should be hashed
      createdAt: new Date().toISOString(),
      subscription: null,
      messages: [],
      profilePicture: null,
      fullName: "",
      phone: "",
    }

    users.push(newUser)
    await writeJsonFile(USERS_FILE, users)

    res.json({ success: true, message: "User registered successfully" })
  } catch (error) {
    console.error("Registration error:", error)
    res.json({ success: false, message: "Registration failed" })
  }
})

// User Login
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body

    const users = await readJsonFile(USERS_FILE)
    const user = users.find((u) => u.username === username && u.password === password)

    if (user) {
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user
      res.json({ success: true, user: userWithoutPassword })
    } else {
      res.json({ success: false, message: "Invalid credentials" })
    }
  } catch (error) {
    console.error("Login error:", error)
    res.json({ success: false, message: "Login failed" })
  }
})

// Get wallet availability
app.get("/api/wallet-availability", async (req, res) => {
  try {
    const walletAvailability = await readJsonFile(WALLET_AVAILABILITY_FILE)
    res.json(walletAvailability)
  } catch (error) {
    console.error("Error fetching wallet availability:", error)
    res.json({})
  }
})

// Get wallet coin availability
app.get("/api/wallet-coin-availability", async (req, res) => {
  try {
    const walletCoinAvailability = await readJsonFile(WALLET_COIN_AVAILABILITY_FILE)
    res.json(walletCoinAvailability)
  } catch (error) {
    console.error("Error fetching wallet coin availability:", error)
    res.json({})
  }
})

// Activate subscription code
app.post("/api/activate-code", async (req, res) => {
  try {
    const { code } = req.body

    const auths = await readJsonFile(AUTHS_FILE)
    const authCode = auths.find((a) => a.code === code && a.status === "available")

    if (!authCode) {
      return res.json({ success: false, message: "Invalid or used code" })
    }

    // Mark code as used
    authCode.status = "used"
    authCode.dateUsed = new Date().toISOString()

    // Calculate expiry date based on plan
    const expiryDates = {
      "1month": 30,
      "3months": 90,
      "6months": 180,
      "8months": 240,
      "1year": 365,
    }

    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + expiryDates[authCode.plan])

    const subscription = {
      plan: authCode.plan,
      expiry: expiryDate.toISOString(),
      activatedAt: new Date().toISOString(),
    }

    await writeJsonFile(AUTHS_FILE, auths)

    res.json({ success: true, subscription })
  } catch (error) {
    console.error("Code activation error:", error)
    res.json({ success: false, message: "Code activation failed" })
  }
})

// Update user subscription
app.post("/api/update-user-subscription", async (req, res) => {
  try {
    const { username, subscription, code } = req.body

    const users = await readJsonFile(USERS_FILE)
    const userIndex = users.findIndex((u) => u.username === username)

    if (userIndex !== -1) {
      users[userIndex].subscription = subscription

      // Update auth code with user info
      const auths = await readJsonFile(AUTHS_FILE)
      const authCode = auths.find((a) => a.code === code)
      if (authCode) {
        authCode.usedBy = username
      }

      await writeJsonFile(USERS_FILE, users)
      await writeJsonFile(AUTHS_FILE, auths)

      res.json({ success: true })
    } else {
      res.json({ success: false, message: "User not found" })
    }
  } catch (error) {
    console.error("Update subscription error:", error)
    res.json({ success: false, message: "Update failed" })
  }
})

// Update user profile
app.post("/api/update-profile", async (req, res) => {
  try {
    const { username, updates } = req.body

    const users = await readJsonFile(USERS_FILE)
    const userIndex = users.findIndex((u) => u.username === username)

    if (userIndex !== -1) {
      // Update user with new data
      Object.keys(updates).forEach((key) => {
        if (updates[key] !== undefined) {
          users[userIndex][key] = updates[key]
        }
      })

      await writeJsonFile(USERS_FILE, users)
      res.json({ success: true })
    } else {
      res.json({ success: false, message: "User not found" })
    }
  } catch (error) {
    console.error("Update profile error:", error)
    res.json({ success: false, message: "Update failed" })
  }
})

// Change password
app.post("/api/change-password", async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body

    const users = await readJsonFile(USERS_FILE)
    const userIndex = users.findIndex((u) => u.username === username)

    if (userIndex === -1) {
      return res.json({ success: false, message: "User not found" })
    }

    // Verify current password
    if (users[userIndex].password !== currentPassword) {
      return res.json({ success: false, message: "Current password is incorrect" })
    }

    // Update password
    users[userIndex].password = newPassword
    await writeJsonFile(USERS_FILE, users)

    res.json({ success: true })
  } catch (error) {
    console.error("Change password error:", error)
    res.json({ success: false, message: "Password change failed" })
  }
})

// Submit flash request
app.post("/api/flash-request", async (req, res) => {
  try {
    const flashData = req.body

    // Read existing flash requests
    const flashRequests = await readJsonFile(FLASH_REQUESTS_FILE)

    // Add new flash request
    const flashRequest = {
      ...flashData,
      status: "pending",
      submittedAt: new Date().toISOString(),
    }

    flashRequests.push(flashRequest)

    // Save flash requests
    await writeJsonFile(FLASH_REQUESTS_FILE, flashRequests)

    res.json({ success: true, flashId: flashData.flashId })
  } catch (error) {
    console.error("Flash request error:", error)
    res.json({ success: false, message: "Flash request failed" })
  }
})

// Admin Routes

// Get all users
app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await readJsonFile(USERS_FILE)
    // Remove passwords from response and add pro status
    const usersWithoutPasswords = users.map(({ password, ...user }) => {
      const isPro = user.subscription && new Date(user.subscription.expiry) > new Date()
      return {
        ...user,
        isPro: isPro,
      }
    })
    res.json(usersWithoutPasswords)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.json([])
  }
})

// Get all flash requests
app.get("/api/admin/flash-requests", async (req, res) => {
  try {
    const flashRequests = await readJsonFile(FLASH_REQUESTS_FILE)
    res.json(flashRequests)
  } catch (error) {
    console.error("Error fetching flash requests:", error)
    res.json([])
  }
})

// Get wallet availability for admin
app.get("/api/admin/wallet-availability", async (req, res) => {
  try {
    const walletAvailability = await readJsonFile(WALLET_AVAILABILITY_FILE)
    res.json(walletAvailability)
  } catch (error) {
    console.error("Error fetching wallet availability:", error)
    res.json({})
  }
})

// Get wallet coin availability for admin
app.get("/api/admin/wallet-coin-availability", async (req, res) => {
  try {
    const walletCoinAvailability = await readJsonFile(WALLET_COIN_AVAILABILITY_FILE)
    res.json(walletCoinAvailability)
  } catch (error) {
    console.error("Error fetching wallet coin availability:", error)
    res.json({})
  }
})

// Set wallet status
app.post("/api/admin/set-wallet-status", async (req, res) => {
  try {
    const { wallet, isAvailable } = req.body

    const walletAvailability = await readJsonFile(WALLET_AVAILABILITY_FILE)
    walletAvailability[wallet] = isAvailable

    await writeJsonFile(WALLET_AVAILABILITY_FILE, walletAvailability)
    res.json({ success: true })
  } catch (error) {
    console.error("Error setting wallet status:", error)
    res.json({ success: false })
  }
})

// Set wallet coin status
app.post("/api/admin/set-wallet-coin-status", async (req, res) => {
  try {
    const { wallet, coin, isAvailable } = req.body

    const walletCoinAvailability = await readJsonFile(WALLET_COIN_AVAILABILITY_FILE)

    if (!walletCoinAvailability[wallet]) {
      walletCoinAvailability[wallet] = {}
    }

    walletCoinAvailability[wallet][coin] = isAvailable

    await writeJsonFile(WALLET_COIN_AVAILABILITY_FILE, walletCoinAvailability)
    res.json({ success: true })
  } catch (error) {
    console.error("Error setting wallet coin status:", error)
    res.json({ success: false })
  }
})

// Get auth codes
app.get("/api/admin/auth-codes", async (req, res) => {
  try {
    const codes = await readJsonFile(AUTHS_FILE)
    const stats = {
      total: codes.length,
      used: codes.filter((c) => c.status === "used").length,
      available: codes.filter((c) => c.status === "available").length,
    }
    res.json({ codes, stats })
  } catch (error) {
    console.error("Error fetching auth codes:", error)
    res.json({ codes: [], stats: { total: 0, used: 0, available: 0 } })
  }
})

// Delete user
app.post("/api/admin/delete-user", async (req, res) => {
  try {
    const { username } = req.body
    const users = await readJsonFile(USERS_FILE)
    const filteredUsers = users.filter((u) => u.username !== username)
    await writeJsonFile(USERS_FILE, filteredUsers)
    res.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    res.json({ success: false })
  }
})

// Mark flash request as done
app.post("/api/admin/mark-done", async (req, res) => {
  try {
    const { flashId } = req.body
    const flashRequests = await readJsonFile(FLASH_REQUESTS_FILE)

    const request = flashRequests.find((r) => r.flashId === flashId)
    if (request) {
      request.status = "completed"
      request.completedAt = new Date().toISOString()

      await writeJsonFile(FLASH_REQUESTS_FILE, flashRequests)

      // Send notification to user
      const users = await readJsonFile(USERS_FILE)
      const userIndex = users.findIndex((u) => u.username === request.username)

      if (userIndex !== -1) {
        if (!users[userIndex].messages) {
          users[userIndex].messages = []
        }

        users[userIndex].messages.push({
          title: `FLASHING ${flashId} SUCCESSFUL`,
          text: `Successfully flashed to ${request.walletAddress}. Completed at: ${new Date().toLocaleString()}`,
          timestamp: new Date().toISOString(),
          read: false,
        })

        await writeJsonFile(USERS_FILE, users)
      }

      res.json({ success: true })
    } else {
      res.json({ success: false, message: "Flash request not found" })
    }
  } catch (error) {
    console.error("Error marking flash as done:", error)
    res.json({ success: false })
  }
})

// Mark flash request as failed
app.post("/api/admin/mark-failed", async (req, res) => {
  try {
    const { flashId } = req.body
    const flashRequests = await readJsonFile(FLASH_REQUESTS_FILE)

    const request = flashRequests.find((r) => r.flashId === flashId)
    if (request) {
      request.status = "failed"
      request.failedAt = new Date().toISOString()

      await writeJsonFile(FLASH_REQUESTS_FILE, flashRequests)

      // Send notification to user
      const users = await readJsonFile(USERS_FILE)
      const userIndex = users.findIndex((u) => u.username === request.username)

      if (userIndex !== -1) {
        if (!users[userIndex].messages) {
          users[userIndex].messages = []
        }

        users[userIndex].messages.push({
          title: `FLASHING ${flashId} FAILED`,
          text: `Flash request to ${request.walletAddress} has failed. Please contact support for assistance. Failed at: ${new Date().toLocaleString()}`,
          timestamp: new Date().toISOString(),
          read: false,
        })

        await writeJsonFile(USERS_FILE, users)
      }

      res.json({ success: true })
    } else {
      res.json({ success: false, message: "Flash request not found" })
    }
  } catch (error) {
    console.error("Error marking flash as failed:", error)
    res.json({ success: false })
  }
})

// Generate new codes
app.post("/api/admin/generate-codes", async (req, res) => {
  try {
    const { count } = req.body
    const codes = await readJsonFile(AUTHS_FILE)

    const plans = ["1month", "3months", "6months", "8months", "1year"]
    let generated = 0

    plans.forEach((plan) => {
      for (let i = 0; i < count; i++) {
        codes.push({
          code: generateCode(),
          plan: plan,
          status: "available",
          usedBy: null,
          dateUsed: null,
        })
        generated++
      }
    })

    await writeJsonFile(AUTHS_FILE, codes)
    res.json({ success: true, generated })
  } catch (error) {
    console.error("Error generating codes:", error)
    res.json({ success: false })
  }
})

// Export codes
app.get("/api/admin/export-codes", async (req, res) => {
  try {
    const codes = await readJsonFile(AUTHS_FILE)
    res.setHeader("Content-Type", "application/json")
    res.setHeader("Content-Disposition", "attachment; filename=auth-codes.json")
    res.send(JSON.stringify(codes, null, 2))
  } catch (error) {
    console.error("Error exporting codes:", error)
    res.status(500).json({ success: false })
  }
})

// Get wallet configurations
app.get("/api/admin/wallet-configurations", async (req, res) => {
  try {
    const walletConfigurations = await readJsonFile(path.join(__dirname, "data", "wallet-configurations.json"))
    res.json(walletConfigurations)
  } catch (error) {
    console.error("Error fetching wallet configurations:", error)
    res.json({})
  }
})

// Save wallet configuration (for Token Pocket and Crypto.com)
app.post("/api/admin/save-wallet-config", async (req, res) => {
  try {
    const { wallet, config } = req.body

    const walletConfigurations = await readJsonFile(path.join(__dirname, "data", "wallet-configurations.json"))

    // Update configuration
    walletConfigurations[wallet] = config

    await writeJsonFile(path.join(__dirname, "data", "wallet-configurations.json"), walletConfigurations)
    res.json({ success: true })
  } catch (error) {
    console.error("Error saving wallet configuration:", error)
    res.json({ success: false })
  }
})

// Save network configuration (for MetaMask and Atomic)
app.post("/api/admin/save-network-config", async (req, res) => {
  try {
    const { wallet, network, config } = req.body

    const walletConfigurations = await readJsonFile(path.join(__dirname, "data", "wallet-configurations.json"))

    // Ensure wallet and networks objects exist
    if (!walletConfigurations[wallet]) {
      walletConfigurations[wallet] = { networks: {} }
    }

    if (!walletConfigurations[wallet].networks) {
      walletConfigurations[wallet].networks = {}
    }

    // Update network configuration
    walletConfigurations[wallet].networks[network] = config

    await writeJsonFile(path.join(__dirname, "data", "wallet-configurations.json"), walletConfigurations)
    res.json({ success: true })
  } catch (error) {
    console.error("Error saving network configuration:", error)
    res.json({ success: false })
  }
})

// Get wallet configurations for users
app.get("/api/wallet-configurations", async (req, res) => {
  try {
    const walletConfigurations = await readJsonFile(path.join(__dirname, "data", "wallet-configurations.json"))
    res.json(walletConfigurations)
  } catch (error) {
    console.error("Error fetching wallet configurations:", error)
    res.json({})
  }
})

// Serve static files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// Start server
async function startServer() {
  await initializeDataFiles()

  app.listen(PORT, () => {
    console.log(`CBL COIN FLASHER server running on port ${PORT}`)
    console.log(`Visit http://localhost:${PORT} to access the application`)
    console.log(`Admin panel: http://localhost:${PORT}/admin.html`)
    console.log(`Admin credentials: cblcoinflasheradmin / cblcoinflasher&$`)
  })
}

startServer()
