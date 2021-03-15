import { Command, CommandMessage, Guard } from '@typeit/discord';
import { DMOnly } from '../guards/DMOnly';
import { Game } from '../util/stateManager';
import currentGameState from '../util/stateManager';
import { NotBot } from '../guards/NotBot';
import { PreGame } from '../guards/PreGame';

export abstract class AddGame {
    @Command('addgame :gameKey  :gameLink')
    @Guard(DMOnly, NotBot, PreGame)
    async addGame(command: CommandMessage) {
        if (currentGameState.giftPool[command.author.id]) {
            command.reply('Only one game per person!');
            return;
        }
        const { gameKey, gameLink } = command.args;
        const embeds = command.embeds;

        const newGameSubmission: Game = {
            gameKey,
            gameLink,
            donator: command.author,
            embed: embeds.length ? embeds[0] : null,
        };
        currentGameState.giftPool.set(command.author.id, newGameSubmission);
        currentGameState.registeredGamers.push({
            user: command.author,
        });
        command.reply('Game successfully added!');
    }
}
