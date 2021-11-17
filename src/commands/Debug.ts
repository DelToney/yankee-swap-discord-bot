import { Command, CommandMessage, Guard } from '@typeit/discord';
import { DMOnly } from '../guards/DMOnly';
import { Game } from '../util/stateManager';
import currentGameState from '../util/stateManager';
import { NotBot } from '../guards/NotBot';
import { startTurn } from '../util/gameFunctions';

export abstract class Debug {
    @Command('debug :debugCommand')
    @Guard(DMOnly, NotBot)
    async debug(command: CommandMessage) {
        switch (command.args.debugCommand) {
            case 'gameState':
                console.log(JSON.stringify(currentGameState));
                return;
            case 'restart':
                currentGameState.currentTurn = 1;
                currentGameState.registeredGamers = currentGameState.registeredGamers.map((gmr) => ({
                    ...gmr,
                    selectedGift: null,
                }));
                startTurn();
                return;
            default:
                try {
                    const inputStateStringMatch = command.content.match(/```[^{]*(\{[\s\S]*)```/imu);
                    let inputState;
                    eval('inputState = ' + inputStateStringMatch[1]);
                    console.log('aaaa');
                    Object.assign(currentGameState, inputState);
                } catch (err) {
                    command.reply('game state is invalid! ' + err.message);
                }
        }
    }
}
