const cron = require("node-cron");
const { exec } = require("child_process");

console.log("⏰ Starting daily YouTube cookie refresher...");

// Run every 24 hours (at midnight)
cron.schedule("0 0 * * *", () => {
  console.log(`[${new Date().toISOString()}] 🔄 Refreshing YouTube cookies...`);

  exec("node scripts/fetch-youtube-cookies.js", (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Cookie refresh error:", error.message);
      return;
    }
    if (stderr) console.warn("⚠️ stderr:", stderr);
    console.log(stdout);
  });
});
