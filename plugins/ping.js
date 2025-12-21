const { Module } = require("../lib/plugins");

Module({
  command: "ping",
  package: "mics",
  description: "Replies with the bot latency",
})(async (message) => {

  const start = Date.now();
  const name = message.pushName || "User";
  const number = message.sender.split("@")[0];

  // ✅ vCard with USER NAME
  const gift = {
    key: {
      fromMe: false,
      remoteJid: message.from,
    },
    message: {
      contactMessage: {
        displayName: name,
        vcard: `BEGIN:VCARD
VERSION:3.0
N:${name};;;;
FN:${name}
TEL;type=CELL;waid=${number}:${number}
END:VCARD`,
      },
    },
  };

  const emojis = [
    "⛅","👻","⛄","👀","🪁","🪃","🎳","🎀","🌸",
    "🍥","🍓","🍡","💗","🦋","💫","💀","☁️",
    "🌨️","🌧️","🌦️","🌥️","⚡","🌟","🎐",
    "🏖️","🌊","🐚","🍒","🍇","🍉","🌻",
    "🎢","🚀","🍫","💎","🌙","🪐","🌲",
    "🍃","🍂","🍁","🍄","🌿","🐞","🐍",
    "🕊️","🎃","🎡","🥂","🗿","⛩️"
  ];

  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  await message.react(emoji);

  const latency = Date.now() - start;

  await message.conn.sendMessage(
    message.from,
    {
      text: `*${emoji} ⧫ 𝔓⦿𝖓𝖌 ${latency} 𝖒ˢ*`,
      contextInfo: {
        mentionedJid: [message.sender],
      },
    },
    { quoted: gift }
  );

});
