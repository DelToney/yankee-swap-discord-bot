import { Command, CommandMessage, Guard } from '@typeit/discord';
import { NotBot } from '../guards/NotBot';
import { listPlayerOrder } from '../util/gameFunctions';
export abstract class ListPlayerOrder {
    @Command('list')
    @Guard(NotBot)
    async list(command: CommandMessage) {
        await listPlayerOrder(command);
    }
}
