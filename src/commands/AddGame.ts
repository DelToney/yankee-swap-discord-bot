import { Command, CommandMessage, Guard } from '@typeit/discord';
import { DMOnly } from '../guards/DMOnly';
import { Game } from '../util/stateManager';
import currentGameState from '../util/stateManager';
import { NotBot } from '../guards/NotBot';

export abstract class AddGame {
    @Command('addgame :gameKey  :gameLink')
    @Guard(DMOnly, NotBot)
    async addGame(command: CommandMessage) {
        if (currentGameState.giftPool[command.author.id]) {
            command.reply('Only one game per person!');
            return;
        }
        const { gameKey, gameLink } = command.args;
        const newGameSubmission: Game = { gameKey, gameLink, donator: command.author };
        currentGameState.giftPool.set(command.author.id, newGameSubmission);
        currentGameState.registeredGamers.push({
            user: command.author,
        });
        command.reply('Game successfully added!');
    }
}
