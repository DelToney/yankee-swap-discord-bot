import { Command, CommandMessage, Guard } from '@typeit/discord';
import { ChannelOnly } from '../guards/ChannelOnly';
import { GameNotStarted } from '../guards/GameNotStarted';
import { generateTurnOrder, listPlayerOrder, startTurn } from '../util/gameFunctions';
import currentGameState from '../util/stateManager';

export abstract class Begin {
    @Command('begin')
    @Guard(GameNotStarted, ChannelOnly)
    async begin(command: CommandMessage) {
        generateTurnOrder(currentGameState.registeredGamers);
        currentGameState.gameChannel = command.channel;
        currentGameState.currentTurn = 1;
        listPlayerOrder();
        currentGameState.begun = true;
        command.channel.send('the game has begun!');

        startTurn({ gamer: currentGameState.registeredGamers.find((gmr) => gmr.turnNumber === 1) });
    }
}
