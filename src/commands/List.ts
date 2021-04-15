import { Command, CommandMessage, Guard } from '@typeit/discord';
import { TextChannel } from 'discord.js';
import { NotBot } from '../guards/NotBot';
import { listPlayerOrder } from '../util/gameFunctions';
export abstract class ListPlayerOrder {
    @Command('list')
    @Guard(NotBot)
    async list(command: CommandMessage) {
        try {
            await listPlayerOrder(command.channel as TextChannel);
        } catch (err) {
            if (err.message === 'Not enough registered players!') {
                command.channel.send('Not enough registered players!');
            } else {
                console.error(err);
            }
        }
    }
}
