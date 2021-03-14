import { Command, CommandMessage, Guard } from '@typeit/discord';
import { DMOnly } from '../guards/DMOnly';
import { Game } from '../util/stateManager';
import currentGameState from '../util/stateManager';
import { NotBot } from '../guards/NotBot';

export abstract class Debug {
    @Command('debug :debugCommand')
    @Guard(DMOnly, NotBot)
    async debug(command: CommandMessage) {
        // const { gameKey, gameLink } = command.args;
        try {
            const inputStateStringMatch = command.content.match(/```[^{]*(\{[\s\S]*)```/imu);
            let inputState;
            eval('inputState = ' + inputStateStringMatch[1]);
            Object.assign(currentGameState, inputState);
        } catch (err) {
            command.reply('game state is invalid! ' + err.message);
        }
        // const newGameSubmission: Game = { gameKey, gameLink, donator: command.author  } ;
        // currentGameState.giftPool[command.author.id] = newGameSubmission;
        // currentGameState.registeredGamers.push({
        //   user: command.author
        // })
        command.reply('squish');
    }
}
