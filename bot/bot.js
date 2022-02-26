const { Client } = require('discord.js');
const axios = require('axios');

const cfg = require('../config.json');

const { loadEvents } = require('./handlers/event');
const { loadCommands } = require('./handlers/command');

const client = new Client({ intents: [], partials: [], allowedMentions: { parse: ['users'], repliedUser: true } });

client.cfg = cfg;
client.inUse = false;
client.queue = [];

loadEvents(client);
loadCommands(client);

axios.post('https://api.lovense.com/api/lan/getQrCode', {
    token: client.cfg.Lovense.Token,
    uid: client.cfg.Lovense.UID
}).then(res => {
    console.log(`NOTE: You need to scan this QR code using the app on a mobile device for this bot to work. ${res.data.message}`);
}).catch(err => {
    // Todo - Throw this correctly.
    console.log(err);
});

client.login(client.cfg.Discord.Token).then(() => {
    console.log(`[Bot] Logged In. (${client.user.tag})`);
});
