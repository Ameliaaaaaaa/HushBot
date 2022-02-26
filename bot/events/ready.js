const { registerSlash } = require('../handlers/command');
const { sendCommand } = require('../../utils/commands');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    event: 'ready',

    async execute(client) {
        await client.user.setActivity('out for commands.', { type: 'WATCHING' });
        await registerSlash(client);

        if (client.cfg.Settings.QueueCommands) {
            console.log('[Bot] Queue Handler Started.');

            setInterval(async () => {
                try {
                    const queue = client.queue;

                    if (queue.length !== 0 && !client.inUse) {
                        await sendCommand(client, queue[0].Interaction, queue[0].Command);
                        await sleep(queue[0].Command.Time * 1000);

                        client.queue.pop();
                    }
                } catch (e) {
                    console.log('[Bot] handleQueue Failed.');
                }
            }, 1000);
        }

        console.log('[Bot] Ready.');
    }
}
