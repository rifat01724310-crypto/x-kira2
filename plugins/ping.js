const { Module } = require("../lib/plugins");

Module({
  command: "ping",
  package: "mics",
  description: "Replies with the bot latency",
})(async (message) => {
  const start = Date.now();

  // 🔹 Fake Contact (Quote)
  const gift = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
    },
    message: {
      contactMessage: {
        displayName: message.pushName || "User",
        vcard: `BEGIN:VCARD
VERSION:3.0
N:;STARK;;;
FN:STARK-MD
item1.TEL;waid=${message.sender.split("@")[0]}:${message.sender.split("@")[0]}
item1.X-ABLabel:Mobile
END:VCARD`,
      },
    },
  };

  // 🔹 Emojis
  const emojis = ["⚡","🚀","🌟","💎","🦋","🔥","🌙"];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  try { await message.react(emoji); } catch {}

  // 🔹 USER Profile Picture
  let pfp;
  try {
    pfp = await message.conn.profilePictureUrl(message.sender, "image");
  } catch {
    pfp = "https://i.imgur.com/6RLs7pM.png"; // fallback
  }

  const latency = Date.now() - start;

  // 🔹 Send Image + Caption (PFP guaranteed)
  await message.conn.sendMessage(
    message.from,
    {
      image: { url: pfp },
      caption:
        `*${emoji} ⧫𝔓⦿𝖓𝖌*\n` +
        `➤ *Latency:* ${latency} ms\n` +
        `➤ *User:* @${message.sender.split("@")[0]}`,
      mentions: [message.sender],
    },
    { quoted: gift }
  );
});
