import { Command, CommandMessage } from '@typeit/discord';
import { messages } from '../util/script.i18n';
import currentGameState from '../util/stateManager';

export abstract class Register {
    @Command('register')
    async register(command: CommandMessage) {
        const welcomeMessage = await command.author.send(messages.addGameHelpMessage);
    }
}
