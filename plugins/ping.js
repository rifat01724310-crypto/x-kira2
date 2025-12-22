const { Module } = require("../lib/plugins");

Module({
  command: "ping",
  package: "mics",
  description: "Replies with the bot latency",
})(async (message) => {
  const start = Date.now();

  const gift = {
    key: {
      fromMe: false,
      participant: `0@s.whatsapp.net`,
      remoteJid: "status@broadcast",
    },
    message: {
      contactMessage: {
        displayName: message.pushName,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${message.conn.user.name}\nitem1.TEL;waid=${
          message.conn.user.id.split("@")[0]
        }:${
          message.conn.user.id.split("@")[0]
        }\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
      },
    },
  };

  const emojis = ["⛅","👻","⛄","👀","🪁","🪃","🎳","🎀","🌸","🍥","🎀","🍓","🍡","💗","🦋","💫","💀","☁️","🌨️"];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  await message.react(emoji);
  const latency = Date.now() - start;

  await message.conn.sendMessage(
    message.from,
    {
      text: `*${emoji}⧫𝔓⦿𝖓𝖌 ${latency} 𝖒ˢ*`,
      contextInfo: {
        mentionedJid: [message.sender],
      },
    },
    { quoted: gift }
  );
});
