import { Command, CommandMessage, Guard } from '@typeit/discord';
import { TextChannel } from 'discord.js';
import { ChannelOnly } from '../guards/ChannelOnly';
import { GameNotStarted } from '../guards/GameNotStarted';
import { generateTurnOrder, listPlayerOrder, startTurn } from '../util/gameFunctions';
import currentGameState from '../util/stateManager';

export abstract class Begin {
    @Command('begin')
    @Guard(GameNotStarted, ChannelOnly)
    async begin(command: CommandMessage) {
        try {
            generateTurnOrder(currentGameState.registeredGamers);
            currentGameState.gameChannel = command.channel as TextChannel;
            currentGameState.currentTurn = 1;
            listPlayerOrder();
            currentGameState.begun = true;
            command.channel.send('the game has begun!');
            startTurn();
        } catch (err) {
            console.error(err);
        }
    }
}
