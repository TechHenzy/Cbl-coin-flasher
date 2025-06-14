// Debug utility functions for CBL COIN FLASHER
// This file helps troubleshoot configuration issues

// Log wallet configurations
function debugWalletConfigs() {
  fetch("/api/wallet-configurations")
    .then((response) => response.json())
    .then((configs) => {
      console.group("Wallet Configurations")
      console.log("Full configuration object:", configs)

      // Check Token Pocket and Crypto.com
      console.group("Simple RPC Wallets")
      if (configs["Token Pocket"]) {
        console.log("Token Pocket RPC URL:", configs["Token Pocket"].rpcUrl || "Not set")
      } else {
        console.log("Token Pocket configuration not found")
      }

      if (configs["Crypto.com"]) {
        console.log("Crypto.com RPC URL:", configs["Crypto.com"].rpcUrl || "Not set")
      } else {
        console.log("Crypto.com configuration not found")
      }
      console.groupEnd()

      // Check MetaMask and Atomic
      console.group("Network Wallets")

      // Check MetaMask
      if (configs["MetaMask"] && configs["MetaMask"].networks) {
        console.log("MetaMask networks:", Object.keys(configs["MetaMask"].networks))
        for (const network in configs["MetaMask"].networks) {
          console.log(`MetaMask - ${network}:`, configs["MetaMask"].networks[network])
        }
      } else {
        console.log("MetaMask network configurations not found")
      }

      // Check Atomic
      if (configs["Atomic"] && configs["Atomic"].networks) {
        console.log("Atomic networks:", Object.keys(configs["Atomic"].networks))
        for (const network in configs["Atomic"].networks) {
          console.log(`Atomic - ${network}:`, configs["Atomic"].networks[network])
        }
      } else {
        console.log("Atomic network configurations not found")
      }
      console.groupEnd()

      console.groupEnd()
    })
    .catch((error) => {
      console.error("Error fetching wallet configurations:", error)
    })
}

// Debug form field values and attributes
function debugFormFields(formType) {
  console.group(`Form Fields Debug: ${formType}`)

  if (formType === "rpc") {
    const rpcUrl = document.getElementById("rpcUrl")
    console.log("RPC URL value:", rpcUrl.value)
    console.log("RPC URL readonly:", rpcUrl.hasAttribute("readonly"))
    console.log("RPC URL classes:", rpcUrl.className)
  } else if (formType === "extended") {
    const fields = ["networkName", "extendedRpcUrl", "chainId", "currencySymbol", "blockExplorerUrl"]

    fields.forEach((fieldId) => {
      const field = document.getElementById(fieldId)
      if (field) {
        console.log(`${fieldId} value:`, field.value)
        console.log(`${fieldId} readonly:`, field.hasAttribute("readonly"))
        console.log(`${fieldId} classes:`, field.className)
      } else {
        console.log(`${fieldId} element not found`)
      }
    })

    const networkSelect = document.getElementById("extendedCoinSelect")
    if (networkSelect) {
      console.log("Selected network:", networkSelect.value)
    }
  }

  console.groupEnd()
}

// Add debug button to the page (only in development)
function addDebugButton() {
  const debugButton = document.createElement("button")
  debugButton.textContent = "Debug Wallet Configs"
  debugButton.style.position = "fixed"
  debugButton.style.bottom = "10px"
  debugButton.style.right = "10px"
  debugButton.style.zIndex = "9999"
  debugButton.style.padding = "8px 12px"
  debugButton.style.background = "#f97316"
  debugButton.style.color = "white"
  debugButton.style.border = "none"
  debugButton.style.borderRadius = "4px"
  debugButton.style.cursor = "pointer"

  debugButton.onclick = () => {
    debugWalletConfigs()

    // Debug current form if open
    if (document.getElementById("rpcFlashForm").style.display === "block") {
      debugFormFields("rpc")
    } else if (document.getElementById("extendedFlashForm").style.display === "block") {
      debugFormFields("extended")
    }
  }

  document.body.appendChild(debugButton)
}

// Initialize debug tools if in development environment
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  document.addEventListener("DOMContentLoaded", () => {
    addDebugButton()
    console.log("Debug tools initialized for CBL COIN FLASHER")
  })
}
