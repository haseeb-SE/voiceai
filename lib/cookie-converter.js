// ✅ CommonJS style (compatible with require())
function convertJsonCookiesToNetscape(jsonCookies) {
  try {
    const cookies = JSON.parse(jsonCookies)
    let netscapeCookies = "# Netscape HTTP Cookie File\n"

    for (const cookie of cookies) {
      if (!cookie.domain || !cookie.name || cookie.value === undefined) continue

      const domain = cookie.domain.startsWith(".") ? cookie.domain : `.${cookie.domain}`
      const flag = cookie.hostOnly ? "FALSE" : "TRUE"
      const path = cookie.path || "/"
      const secure = cookie.secure ? "TRUE" : "FALSE"

      let expiration = "0"
      if (cookie.expirationDate) {
        expiration = Math.floor(cookie.expirationDate).toString()
      } else if (cookie.session === false) {
        expiration = Math.floor(Date.now() / 1000 + 31536000).toString()
      }

      const cookieLine = [domain, flag, path, secure, expiration, cookie.name, cookie.value].join("\t")
      netscapeCookies += cookieLine + "\n"
    }

    return netscapeCookies
  } catch (error) {
    console.error("Error converting cookies:", error)
    return "# Netscape HTTP Cookie File\n"
  }
}

module.exports = { convertJsonCookiesToNetscape }
