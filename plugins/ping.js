const { Module } = require("../lib/plugins");

Module({
  command: "ping",
  package: "mics",
  description: "Replies with the bot latency",
})(async (message) => {
  const start = Date.now();

  let gift = {
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
N:;Gifted;;;
FN:Gifted
item1.TEL;waid=${message.sender.split("@")[0]}:${message.sender.split("@")[0]}
item1.X-ABLabel:Mobile
END:VCARD`,
      },
    },
  };

  const emojis = [
    "⛅","👻","⛄","👀","🪁","🎳","🌸","🍓","💗",
    "🦋","⚡","🌟","🏖️","🌊","🍒","🌻","🚀",
    "💎","🌙","🪐","🌲","🍂","🕊️","🎃","🥂","🗿"
  ];

  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  try {
    await message.react(emoji);
  } catch {}

  const latency = Date.now() - start;

  await message.conn.sendMessage(
    message.from,
    {
      text: `*${emoji} ⧫𝔓⦿𝖓𝖌 ${latency} ms*`,
      contextInfo: {
        mentionedJid: [message.sender],
        forwardingScore: 5,
        isForwarded: false,
      },
    },
    { quoted: gift }
  );
});
