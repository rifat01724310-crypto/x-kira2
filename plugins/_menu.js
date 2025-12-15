const os = require("os");
const { Module, commands } = require("../lib/plugins");
const { getTheme } = require("../Themes/themes");
const theme = getTheme();
const settings = require("../lib/database/settingdb");
const { getRandomPhoto } = require("./bin/menu_img");
const config = require("../config");
const name = "X-kira ━ 𝐁𝕺𝐓";
const runtime = (secs) => {
  const pad = (s) => s.toString().padStart(2, "0");
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
};
const readMore = String.fromCharCode(8206).repeat(4001);

Module({
  command: "menu",
  package: "general",
  description: "Show all commands or a specific package",
})(async (message, match) => {
  const time = new Date().toLocaleTimeString("en-ZA", {
    timeZone: "Africa/Johannesburg",
  });

  const userName = message.pushName || "User";
  const usedGB = ((os.totalmem() - os.freemem()) / 1073741824).toFixed(2);
  const totGB = (os.totalmem() / 1073741824).toFixed(2);
  const ram = `${usedGB} / ${totGB} GB`;
  const grouped = commands
    .filter((cmd) => cmd.command && cmd.command !== "undefined")
    .reduce((acc, cmd) => {
      if (!acc[cmd.package]) acc[cmd.package] = [];
      acc[cmd.package].push(cmd.command);
      return acc;
    }, {});
  const workType =
    settings.getGlobal("WORK_TYPE") ??
    config.WORK_TYPE ??
    "public";
  const prefix =
    settings.getGlobal("prefix") ??
    config.prefix ??
    ".";
      const menuInfo =
    settings.getGlobal("MENU_INFO") ??
    config.MENU_INFO ??
    "bot,https://i.postimg.cc/pVZd1X4L/DM-FOR-PAID-PROMOTION-B-o-y-P-F-P-𝐼𝐺-3.webp,photo";
  const [name, media, type] = menuInfo.split(',').map(v => v.trim());
  const categories = Object.keys(grouped).sort();
  let _cmd_st = "";

  if (match && grouped[match.toLowerCase()]) {
    const pack = match.toLowerCase();
    _cmd_st += `\n *╭────❒ ${pack.toUpperCase()} ❒⁠⁠⁠⁠*\n`;
    grouped[pack]
      .sort((a, b) => a.localeCompare(b))
      .forEach((cmdName) => {
        _cmd_st += ` *├◈ ${cmdName}*\n`;
      });
    _cmd_st += ` *┕──────────────────❒*\n`;
  } else {
    _cmd_st += `
*╭══〘〘 ${name} 〙〙*
*┃❍ ʀᴜɴ     :* ${runtime(process.uptime())}
*┃❍ ᴍᴏᴅᴇ    :* ${workType}
*┃❍ ᴘʀᴇғɪx  :* ${prefix}
*┃❍ ʀᴀᴍ     :* ${ram}
*┃❍ ᴛɪᴍᴇ    :* ${time}
*┃❍ ᴜsᴇʀ    :* ${userName}
*╰═════════════════⊷*
${readMore}
*♡︎•━━━━━━☻︎━━━━━━•♡︎*
`;
    if (match && !grouped[match.toLowerCase()]) {
      _cmd_st += `\n⚠️ *Package not found: ${match}*\n\n`;
      _cmd_st += `*Available Packages*:\n`;
      categories.forEach((cat) => {
        _cmd_st += `├◈ ${cat}\n`;
      });
    } else {
      for (const cat of categories) {
        _cmd_st += `\n *╭────❒ ${cat.toUpperCase()} ❒⁠⁠⁠⁠*\n`;
        grouped[cat]
          .sort((a, b) => a.localeCompare(b))
          .forEach((cmdName) => {
            _cmd_st += ` *├◈ ${cmdName}*\n`;
          });
        _cmd_st += ` *┕──────────────────❒*\n`;
      }
    }
    _cmd_st += `\nᴛʜᴇ ʜᴇᴀʀᴛ ʜᴀᴄᴋᴇʀ ɢɪʀʟ
   𐏓꯭꯭❀𝄄𝄀꯭𝄄꯭ 𝐙͟𝐚͟𝐫͟𝐢͟𝐬͟𝐡͟𝐚͟❀͟𝄄𝄀꯭𝄄꯭⸙⟶`;
  }
  if (type === "image") {
    await message.conn.sendMessage(message.from, {
      image: { url: media },
      caption: _cmd_st,
    });
  } else if (type === "video") {
    await message.conn.sendMessage(message.from, {
      video: { url: media },
      caption: _cmd_st,
      gifPlayback: false
    });
  } else if (type === "gif") {
    await message.conn.sendMessage(message.from, {
      video: { url: media },
      caption: _cmd_st,
      gifPlayback: true
    });
  }
});


Module({
  command: "list",
  package: "general",
  description: "Show all available commands (with package, description and optional usage)",
})(async (message) => {
  try {
    // build header
    let out = [];
    out.push("*📜 Command list*");
    out.push("");
    // Group commands by package for nicer output
    const grouped = commands
      .filter((c) => c.command) // only real commands
      .reduce((acc, c) => {
        const pkg = (c.package || "other").toLowerCase();
        acc[pkg] = acc[pkg] || [];
        acc[pkg].push(c);
        return acc;
      }, {});

    const pkgs = Object.keys(grouped).sort();
    for (const pkg of pkgs) {
      out.push(`*┏━ ${pkg.toUpperCase()} ━*`);
      // Sort commands alphabetically
      grouped[pkg]
        .sort((a, b) => (a.command || "").localeCompare(b.command || ""))
        .forEach((c) => {
          const name = c.command || "(unknown)";
          const desc = c.description ? `${c.description}` : "No description";
          const usage = c.usage ? `\n  _Usage:_ \`${c.usage}\`` : "";
          out.push(`• *${name}* — ${desc}${usage}`);
        });
      out.push(`*┗━━━━━━━━━━━━━━━━━*`);
      out.push("");
    }

    // join and send
    const text = out.join("\n");
    // If the text is too long you may want to send it as a file — but first try sending as message
    await message.send(text);
  } catch (err) {
    console.error("Error in list plugin:", err);
    await message.send("❌ Failed to fetch command list.");
  }
});

Module({
  command: "alive",
  package: "general",
  description: "Check if bot is alive",
})(async (message) => {
  const hostname = os.hostname();
  const time = new Date().toLocaleTimeString("en-ZA", {
    timeZone: "Africa/Johannesburg",
  });
  const ramUsedMB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  const ctx = `
*${name}* is online

*Time:* ${time}
*Host:* ${hostname}
*RAM Usage:* ${ramUsedMB} MB
*Uptime:* ${hours}h ${minutes}m ${seconds}s
`;

  // 🔹 resolve image source (FAST)
  const imageUrl =
    settings.getGlobal("MENU_URL") ||
    config.MENU_URL ||
    getRandomPhoto();

  // 🔹 send message
  await message.send({
    image: { url: imageUrl },
    caption: ctx,
  });

  await message.send({
    image: { url: getRandomPhoto() },
    caption: ctx,
  });
});


