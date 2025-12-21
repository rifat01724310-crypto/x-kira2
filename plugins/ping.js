const { Module } = require("../lib/plugins");

Module({
  command: "ping",
  package: "mics",
  description: "Replies with bot latency",
})(async (message) => {
  const start = Date.now();
  const userName = message.pushName || "User";

  // Random emoji
  const emojis = ["⛅","👻","⛄","👀","🪁","🎳","🌸","🍓","💗","🦋","💀","☁️","⚡","🌟","🎐","🏖️","🌊","🐚","🍇","🍉","🌻","🚀","🍫","💎","🌋","🏔️","🌙","🪐","🌲","🍂","🍁","🐞","🕊️","🎃","🎡","🥂","⛩️"];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  await message.react(emoji);

  const latency = Date.now() - start;

  // Fancy quoted message
  const gift = {
    key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
    message: { contactMessage: { displayName: userName } }
  };

  await message.conn.sendMessage(
    message.from,
    { text: `*${emoji} 𝐏๏፝֟ƞ̽g: ${latency} 𝐌sᷱ᪳*`, contextInfo: { mentionedJid: [message.sender] } },
    { quoted: gift }
  );
});
