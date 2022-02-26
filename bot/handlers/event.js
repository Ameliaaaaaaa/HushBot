const { readdirSync } = require('fs');

function loadEvents(client) {
    readdirSync('./bot/events').forEach(event => {
        if (event.endsWith('.js')) {
            const ev = require(`../events/${event}`);

            client.on(ev.event, async (...args) => {
                await ev.execute(client, ...args);
            });

            delete require.cache[(require.resolve(`../events/${event}`))];
        }
    });
}

module.exports = { loadEvents };
