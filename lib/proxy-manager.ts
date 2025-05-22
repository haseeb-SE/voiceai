/**
 * Proxy Manager for handling proxy rotation and management
 */

// Define proxy types
interface Proxy {
  url: string
  type: "http" | "https" | "socks4" | "socks5"
  failCount: number
  lastUsed: number
  isActive: boolean
  timeoutCount: number
  successCount: number
}

class ProxyManager {
  private proxies: Proxy[] = []
  private currentProxyIndex = 0
  private maxFailCount = 3
  private maxTimeoutCount = 2
  private debug = true
  private lastRotationTime = 0
  private rotationCooldown = 5000 // 5 seconds cooldown between rotations
  private directConnectionEnabled = true // Allow direct connection as fallback

  constructor() {
    this.initializeProxies()
    console.log(`Initialized proxy manager with ${this.proxies.length} proxies`)
  }

  private initializeProxies() {
    // Load proxies from environment variable if available
    const proxyList = process.env.PROXY_LIST ? process.env.PROXY_LIST.split(",") : []

    // Add some fallback proxies if none provided
    if (proxyList.length === 0) {
      // These are just examples and likely won't work
      // In production, you should use your own proxies
      this.proxies = [
        { url: "direct", type: "http", failCount: 0, timeoutCount: 0, successCount: 0, lastUsed: 0, isActive: true },
        {
          url: "http://localhost:8888",
          type: "http",
          failCount: 0,
          timeoutCount: 0,
          successCount: 0,
          lastUsed: 0,
          isActive: false,
        },
      ]
    } else {
      // Convert the proxy list to Proxy objects
      this.proxies = proxyList.map((proxy) => {
        // Parse proxy string (format: type://host:port)
        const [typeStr, hostPort] = proxy.split("://")
        const type = (typeStr as "http" | "https" | "socks4" | "socks5") || "http"

        return {
          url: proxy,
          type,
          failCount: 0,
          timeoutCount: 0,
          successCount: 0,
          lastUsed: 0,
          isActive: true,
        }
      })
    }

    // Always add direct connection as a fallback
    if (!this.proxies.some((p) => p.url === "direct")) {
      this.proxies.push({
        url: "direct",
        type: "http",
        failCount: 0,
        timeoutCount: 0,
        successCount: 0,
        lastUsed: 0,
        isActive: true,
      })
    }
  }

  /**
   * Get the current proxy
   */
  public getCurrentProxy(): string | null {
    if (this.proxies.length === 0) return null

    // Find the current active proxy
    const activeProxies = this.proxies.filter((p) => p.isActive)
    if (activeProxies.length === 0) {
      // Reset all proxies if none are active
      this.proxies.forEach((p) => (p.isActive = true))
      this.currentProxyIndex = 0
      return this.proxies[0].url === "direct" ? null : this.proxies[0].url
    }

    // Return the current proxy
    const proxy = activeProxies[this.currentProxyIndex % activeProxies.length]
    return proxy.url === "direct" ? null : proxy.url
  }

  /**
   * Get proxy arguments for yt-dlp
   */
  public getProxyArgs(url?: string): string[] {
    const proxy = this.getCurrentProxy()

    // If no proxy or using direct connection, return empty array
    if (!proxy) return []

    // Update last used timestamp
    const proxyObj = this.proxies.find((p) => p.url === proxy)
    if (proxyObj) {
      proxyObj.lastUsed = Date.now()
    }

    // Return proxy arguments for yt-dlp
    if (this.debug) {
      console.log(`Using proxy: --proxy ${proxy}`)
    }

    return ["--proxy", proxy]
  }

  /**
   * Rotate to the next proxy
   */
  public rotateProxy(): string | null {
    const now = Date.now()

    // Check if we're rotating too frequently
    if (now - this.lastRotationTime < this.rotationCooldown) {
      if (this.debug) {
        console.log(`Skipping proxy rotation (cooldown: ${this.rotationCooldown}ms)`)
      }
      return this.getCurrentProxy()
    }

    this.lastRotationTime = now

    if (this.proxies.length <= 1) return this.getCurrentProxy()

    const activeProxies = this.proxies.filter((p) => p.isActive)
    if (activeProxies.length === 0) {
      // Reset all proxies if none are active
      this.proxies.forEach((p) => (p.isActive = true))
      this.currentProxyIndex = 0
    } else {
      // Move to the next proxy
      this.currentProxyIndex = (this.currentProxyIndex + 1) % activeProxies.length
    }

    if (this.debug) {
      const proxy = this.getCurrentProxy()
      console.log(`Rotated to proxy: ${proxy || "direct connection"}`)
    }

    return this.getCurrentProxy()
  }

  /**
   * Mark the current proxy as failed
   */
  public markCurrentProxyAsFailed(isTimeout = false): void {
    const proxy = this.getCurrentProxy()
    if (!proxy) return

    const proxyObj = this.proxies.find((p) => p.url === proxy)
    if (!proxyObj) return

    if (isTimeout) {
      proxyObj.timeoutCount++
      if (this.debug) {
        console.log(`Marked proxy ${proxy} as timed out (count: ${proxyObj.timeoutCount})`)
      }

      // Disable proxy if it has timed out too many times
      if (proxyObj.timeoutCount >= this.maxTimeoutCount) {
        proxyObj.isActive = false
        console.log(`Disabled proxy ${proxy} due to too many timeouts`)
      }
    } else {
      proxyObj.failCount++
      if (this.debug) {
        console.log(`Marked proxy ${proxy} as failed (count: ${proxyObj.failCount})`)
      }

      // Disable proxy if it has failed too many times
      if (proxyObj.failCount >= this.maxFailCount) {
        proxyObj.isActive = false
        console.log(`Disabled proxy ${proxy} due to too many failures`)
      }
    }

    // Rotate to the next proxy
    this.rotateProxy()
  }

  /**
   * Mark the current proxy as successful
   */
  public markCurrentProxyAsSuccessful(): void {
    const proxy = this.getCurrentProxy()
    if (!proxy) return

    const proxyObj = this.proxies.find((p) => p.url === proxy)
    if (!proxyObj) return

    proxyObj.successCount++

    // Reset failure counts after some successes
    if (proxyObj.successCount >= 3) {
      proxyObj.failCount = Math.max(0, proxyObj.failCount - 1)
      proxyObj.timeoutCount = Math.max(0, proxyObj.timeoutCount - 1)
    }
  }

  /**
   * Reset all proxies
   */
  public resetProxies(): void {
    this.proxies.forEach((proxy) => {
      proxy.failCount = 0
      proxy.timeoutCount = 0
      proxy.isActive = true
    })
    this.currentProxyIndex = 0

    if (this.debug) {
      console.log("Reset all proxies")
    }
  }

  /**
   * Enable or disable direct connection
   */
  public setDirectConnectionEnabled(enabled: boolean): void {
    this.directConnectionEnabled = enabled

    // Update the direct proxy
    const directProxy = this.proxies.find((p) => p.url === "direct")
    if (directProxy) {
      directProxy.isActive = enabled
    }

    if (this.debug) {
      console.log(`Direct connection ${enabled ? "enabled" : "disabled"}`)
    }
  }

  /**
   * Get all active proxies
   */
  public getActiveProxies(): string[] {
    return this.proxies.filter((p) => p.isActive).map((p) => (p.url === "direct" ? "Direct Connection" : p.url))
  }
}

// Create a singleton instance
export const proxyManager = new ProxyManager()
