import { CommandMessage } from '@typeit/discord';
import * as turnOrderTemplate from '../util/playerOrderTemplate.json';
import { CollectorFilter, MessageEmbedOptions, ReactionEmoji } from 'discord.js';
import currentGameState, { Gamer } from './stateManager';

export function nextTurn() {
    currentGameState.currentTurn += 1;
}

export async function startTurn(args: { gamer: Gamer }) {
    const { gamer } = args;
    const actionDecisionMessage = await gamer.user.send(
        'Would you like to steal a gift or or choose a from the pool of gifts?',
    );
    actionDecisionMessage.react(':ninja:');
    actionDecisionMessage.react('🎄');

    const decisionFilter: CollectorFilter = (reaction: ReactionEmoji, user) => {
        debugger;
        return reaction.name === ':ninja:' || reaction.name === '🎄';
    };
    const decision = await actionDecisionMessage.awaitReactions(decisionFilter, {});
    debugger;
}

export async function listPlayerOrder(message: CommandMessage) {
    const playerOrderEmbed: MessageEmbedOptions = turnOrderTemplate;

    const sortedGames = currentGameState.registeredGamers.sort((a, b) => a.turnNumber - b.turnNumber);

    sortedGames.forEach((gamer, i) => {
        if (currentGameState.currentTurn === i + 1) {
            playerOrderEmbed.description += `**> ${i + 1} -** ${gamer.user.username}\n`;
        } else {
            playerOrderEmbed.description += `**${i + 1} -** ${gamer.user.username}\n`;
        }
    });

    message.channel.send('', { embed: playerOrderEmbed });
}

export function generateTurnOrder(registeredGamers: Gamer[]) {
    registeredGamers.forEach((gamer, i) => {
        gamer.turnNumber = i + 1; //TODO: Make this random from 0-list length and unique
    });
}
