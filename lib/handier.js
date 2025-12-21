const axios = require("axios");
const fs = require("fs");
const path = require("path");
const config = require("../config");
const BASE_URL = "https://x-kira-json-host.vercel.app";

function extractToken(sessionId) {
  if (!sessionId) return null;
  let m = sessionId.match(/≈\s*([^\^\s]+)/);
  if (m) return m[1].replace(/[^a-zA-Z0-9_-]/g, "");
  let fallback = sessionId.match(/([A-Za-z0-9_-]{6,})/g);
  if (fallback) {
    return fallback.find(t => /[A-Za-z]/.test(t) && /\d/.test(t));
  }
  return null;
}

async function downloadCreds(sessionDir) {
  try {
    const credsId = config.SESSION_ID;
    const sessionPath = path.join(sessionDir, "creds.json");

    // 🔹 STARK-MD~ Mega session support
    if (credsId.startsWith("STARK-MD~")) {
      console.log("[🕸️] DETECTED STARK-MD~SESSION FORMAT");
      const megaId = credsId.replace("STARK-MD~", "").trim();
      if (!megaId) throw new Error("❌ MEGA file ID missing after 'STARK-MD~'.");

      let File;
      try {
        File = require("megajs").File;
      } catch {
        throw new Error("❌ megajs not installed. Run: npm i megajs");
      }

      const file = File.fromURL(`https://mega.nz/file/${megaId}`);
      await file.loadAttributes();
      const data = await new Promise((resolve, reject) => {
        file.download((err, data) => (err ? reject(err) : resolve(data)));
      });

      fs.writeFileSync(sessionPath, data);
      console.log("[✅] STARK-MD~SESSION LOADED SUCCESSFULLY");
      return sessionPath;
    }

    // 🔹 Normal SESSION_ID logic
    const token = extractToken(credsId);
    if (!token) throw new Error("❌ Could not extract token from SESSION_ID");

    if (fs.existsSync(sessionPath)) {
      console.log("session already exists");
      return sessionPath;
    }

    const url = `${BASE_URL}/${encodeURIComponent(token)}`;
    console.log("Downloading creds from:", url);

    const res = await axios.get(url, { timeout: 10000, validateStatus: () => true });
    if (res.status !== 200) throw new Error(`❌ Failed to download creds. Status: ${res.status}`);
    if (!res.data) throw new Error("❌ Empty response from server");

    const creds = typeof res.data === "object" ? res.data : { data: res.data };
    fs.writeFileSync(sessionPath, JSON.stringify(creds, null, 2));
    console.log("[✅] SESSION CONNECTED");
    return sessionPath;

  } catch (err) {
    console.error("❌ downloadCreds error:", err.message);
    throw err;
  }
}

module.exports = { downloadCreds };
