import { CommandMessage } from '@typeit/discord';
import * as turnOrderTemplate from '../util/playerOrderTemplate.json';
import {
    Channel,
    CollectorFilter,
    Message,
    MessageEmbedOptions,
    MessageOptions,
    MessageReaction,
    ReactionEmoji,
    TextChannel,
    User,
} from 'discord.js';
import currentGameState, { Game, Gamer, getUnclaimedGames } from './stateManager';
import { messages } from './script.i18n';

const stealEmoji = '😈';
const giftEmoji = '🎁';
const validPlayerGiftEmojis = [
    '<:PresentEmojiyp:820867491727147048>',
    '<:PresentEmojiob:820867711336448060>',
    '<:PresentEmojiyp:820867636728299541>',
    '<:PresentEmojigr:820867319231414333>',
    '<:PresentEmojirg:820867347074121738>',
    '<:PresentEmojigp:820867183184969789>',
    '<:PresentEmojiby:820867372650463262>',
    '<:PresentEmojirb:820867285039185980>',
    '<:PresentEmojibr:820867458738552832>',
    '<:PresentEmojipy:820867255944216587>',
    '<:PresentEmojibo:820867518373560350>',
    '<:PresentEmojipy:820867687978500147>',
    '<:PresentEmojibbp:820867579261485066>',
    '<:PresentEmojipg:820867550920966194>',
    '<:PresentEmojipbb:820867407349284884>',
    '<:PresentEmojiob:820867609087443014>',
];

export async function nextTurn() {
    currentGameState.currentTurn += 1;
    startTurn();
}

export function updateGamerHeldGame(recieverId: User['id'], donatorId: User['id']) {
    const recieverIndex = currentGameState.registeredGamers.findIndex((gmr) => recieverId === gmr.user.id);
    currentGameState.registeredGamers[recieverIndex] = {
        ...currentGameState.registeredGamers[recieverIndex],
        selectedGift: donatorId,
    };
}

export async function startTurn() {
    const gamer = currentGameState.registeredGamers.find((gmr) => gmr.turnNumber === currentGameState.currentTurn);
    const actionDecisionMessage = await gamer.user.send(messages.pickActionPrompt()); // PROMPT

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
                ChooseGift(gamer);
                return;
            case stealEmoji:
                Steal(gamer);
                return;
        }

        actionDecisionCollector.stop('Decision Made');
    });
}

export async function ChooseGift(gamer: Gamer) {
    const selectGiftDecisionMessage = await gamer.user.send(messages.pickGamePrompt());

    const availableGames = getUnclaimedGames();

    for (let game of availableGames) {
        await selectGiftDecisionMessage.react(game.emoji);
    }

    const decisionFilter: CollectorFilter = (reaction, user) => {
        return availableGames.map((gme) => gme.emoji).includes(`<:${reaction.emoji.identifier}>`);
    };
    // maybe we find a way to not have this be an event handler but for right now we'll just use it
    const selectGiftDecisionCollector = await selectGiftDecisionMessage.createReactionCollector(decisionFilter);
    selectGiftDecisionCollector.once('collect', async (reaction: MessageReaction, user) => {
        const selectedGift: Game = availableGames.find((gme) => gme.emoji === `<:${reaction.emoji.identifier}>`);
        updateGamerHeldGame(gamer.user.id, selectedGift.donator.id);
        currentGameState.gameChannel.send(messages.gamerGotGame(gamer.user.username, selectedGift.gameTitle), {
            embed: selectedGift.embed,
        });
        gamer.user.send(messages.youGotGame(selectedGift.gameTitle), { embed: selectedGift.embed });

        await selectGiftDecisionMessage.delete();
        nextTurn();
        selectGiftDecisionCollector.stop('Decision Made');
    });
}

export async function Steal(gamer: Gamer) {
    const robbablePlayers = currentGameState.registeredGamers.filter((gmr) => gmr.selectedGift);

    const theftMessageOptions: MessageOptions = { content: messages.stealGiftPrompt };

    for (let player of robbablePlayers) {
        const heldGift = currentGameState.giftPool[player.selectedGift];
        theftMessageOptions.embed = {
            title: messages.theftMessageListTitle,
            fields: [
                {
                    name: player.user.username,
                    value: `${heldGift.emoji} - ${heldGift.gameTitle}`,
                },
            ],
        };
    }
    const theftMessage = (await gamer.user.send(theftMessageOptions)) as Message; // PROMPT
    for (let player of robbablePlayers) {
        const heldGift = currentGameState.giftPool[player.selectedGift];
        await theftMessage.react(heldGift.emoji);
    }

    const theftFilter: CollectorFilter = (reaction: ReactionEmoji, user) => {
        return robbablePlayers
            .map((e) => currentGameState.giftPool[e.selectedGift].emoji)
            .includes(reaction.identifier);
    };

    // maybe we find a way to not have this be an event handler but for right now we'll just use it
    const theftCollector = await theftMessage.createReactionCollector(theftFilter);
    theftCollector.once('collect', (reaction: MessageReaction, user) => {
        nextTurn();
        theftCollector.stop(`Decision Made`);
    });
}

export async function listPlayerOrder(channel?: TextChannel) {
    // change this to 3
    if (Object.values(currentGameState.giftPool).length <= 0) {
        throw new Error();
    }
    const playerOrderEmbed: MessageEmbedOptions = turnOrderTemplate;
    //make a fresh list every time
    playerOrderEmbed.description = '';

    const sortedGames = currentGameState.registeredGamers.sort((a, b) => a.turnNumber - b.turnNumber);

    sortedGames.forEach((gamer, i) => {
        const gift = currentGameState.giftPool[gamer.selectedGift];
        const giftText = gift ? ` - ${gift.gameTitle} ${gift.emoji}` : '';
        if (currentGameState.currentTurn === i + 1) {
            playerOrderEmbed.description += `**${i + 1}.** 
            ${currentGameState.giftPool[gamer.user.id].emoji} ${gamer.user.username}${giftText}\n`;
        } else {
            playerOrderEmbed.description += `${i + 1}. 
            ${currentGameState.giftPool[gamer.user.id].emoji} ${gamer.user.username}${giftText}\n`;
        }
    });
    if (channel) {
        channel.send('', { embed: playerOrderEmbed });
    } else {
        currentGameState.gameChannel.send('', { embed: playerOrderEmbed });
    }
}

export function generateTurnOrder(registeredGamers: Gamer[]) {
    const tempEmojis = validPlayerGiftEmojis;
    registeredGamers.forEach((gamer, i) => {
        gamer.turnNumber = i + 1; //TODO: Make this random from 0-list length and unique
        const game: Game = currentGameState.giftPool[gamer.user.id];
        game.emoji = tempEmojis.pop();
        currentGameState.giftPool[gamer.user.id] = game;
    });
}
