import { CommandMessage } from '@typeit/discord';
import * as turnOrderTemplate from '../util/playerOrderTemplate.json';
import { CollectorFilter, Message, MessageEmbedOptions, MessageReaction, ReactionEmoji } from 'discord.js';
import currentGameState, { Game, Gamer } from './stateManager';

const stealEmoji = '😈';
const giftEmoji = '🎁';
const validPlayerGiftEmojis = ['🎁', '📦', '🗳', '🗃'];

export async function nextTurn() {
    currentGameState.currentTurn += 1;
    startTurn();
}

export async function startTurn() {
    const gamer = currentGameState.registeredGamers.find((gmr) => gmr.turnNumber === currentGameState.currentTurn);
    const selectGiftDecisionMessage = await gamer.user.send('Chose a gift to open!');

    const availableGames = currentGameState.getAvailableGames().filter(([uid, gme]) => uid !== gamer.user.id);

    for (let [userId, game] of availableGames) {
        await selectGiftDecisionMessage.react(game.emoji);
    }

    const decisionFilter: CollectorFilter = (reaction, user) => {
        return availableGames.map(([id, gme]) => gme.emoji).includes(reaction.emoji.name);
    };
    // maybe we find a way to not have this be an event handler but for right now we'll just use it
    const selectGiftDecisionCollector = await selectGiftDecisionMessage.createReactionCollector(decisionFilter);
    selectGiftDecisionCollector.once('collect', async (reaction: MessageReaction, user) => {
        await selectGiftDecisionMessage.delete();
        const selectedGift: Game = [...currentGameState.giftPool.entries()].find(
            ([uid, gme]) => gme.emoji === reaction.emoji.name,
        )[1];
        currentGameState.gameChannel.send(`${gamer.user.username} recieved \`GAMEINFOHERE\``);
        gamer.user.send(`You recieved \`GAMEINFOHERE\``);

        selectGiftDecisionCollector.stop('Decision Made');

        const actionDecisionMessage = await gamer.user.send('Stay or Steal?');

        await actionDecisionMessage.react(stealEmoji);
        await actionDecisionMessage.react(giftEmoji);
        const actionDecisionFilter: CollectorFilter = (reaction, user) => {
            return reaction.emoji.name === giftEmoji || reaction.emoji.name === stealEmoji;
        };
        // maybe we find a way to not have this be an event handler but for right now we'll just use it
        const actionDecisionCollector = await actionDecisionMessage.createReactionCollector(actionDecisionFilter);
        actionDecisionCollector.once('collect', (reaction: MessageReaction, user) => {
            switch (reaction.emoji.name) {
                case giftEmoji:
                    nextTurn();
                    return;
                case stealEmoji:
            }

            actionDecisionCollector.stop('Decision Made');
        });
    });
}

export async function listPlayerOrder() {
    if (currentGameState.giftPool.size <= 0) {
        debugger;
        // change this to 2
        throw new Error('Not enough registered players!');
    }
    const playerOrderEmbed: MessageEmbedOptions = turnOrderTemplate;
    //make a fresh list every time
    playerOrderEmbed.description = '';

    const sortedGames = currentGameState.registeredGamers.sort((a, b) => a.turnNumber - b.turnNumber);

    sortedGames.forEach((gamer, i) => {
        if (currentGameState.currentTurn === i + 1) {
            playerOrderEmbed.description += `**${i + 1}.** 
            ${currentGameState.giftPool.get(gamer.user.id).emoji} ${gamer.user.username}\n`;
        } else {
            playerOrderEmbed.description += `${i + 1}. 
            ${currentGameState.giftPool.get(gamer.user.id).emoji} ${gamer.user.username}\n`;
        }
    });
    currentGameState.gameChannel.send('', { embed: playerOrderEmbed });
}

export function generateTurnOrder(registeredGamers: Gamer[]) {
    const tempEmojis = validPlayerGiftEmojis;
    registeredGamers.forEach((gamer, i) => {
        gamer.turnNumber = i + 1; //TODO: Make this random from 0-list length and unique
        const game: Game = currentGameState.giftPool.get(gamer.user.id);
        game.emoji = tempEmojis.pop();
        currentGameState.giftPool.set(gamer.user.id, game);
    });
}
