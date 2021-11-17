import { User } from 'discord.js';
import { I18nResolver } from 'i18n-ts';
import { Gamer } from './stateManager';

const en = {
    gameStart: 'the game has begun!',
    addGameTitlePrompt: 'What is the title of the game youre giving?',
    gameAdded: 'Game successfully added!',
    notEnoughPlayers: 'Not enough players!',
    stealGiftPrompt: "Who's gift do you want to steal?",
    oneGamePerGamer: 'Only one game per person!',
    pickGamePrompt: () => {
        const items = ['Chose a gift to open!'];
        return items[Math.floor(Math.random() * items.length)];
    },
    pickActionPrompt: () => {
        const items = ['Stay or Steal?'];
        return items[Math.floor(Math.random() * items.length)];
    },
    youGotGame: (gameTitle: string) => `You recieved \`${gameTitle}\``,
    gamerGotGame: (gamer: User, gameTitle: string) => `${gamer.toString()} recieved \`${gameTitle}\``,
    gamerStoleGame: (from: User, to: User, gameTitle: string) =>
        `${to.toString()} totally ripped ${from.toString()}'s game right outta their hands and got ' \`${gameTitle}\``,
    theftMessageListTitle: 'Fools to rob from:',
    addGameHelpMessage:
        "Welcome to Del's awful Yankee swap bot!\n\n Simply message me with the command `!addgame <INSERT_GAME_CODE_HERE> <INSERT_GAME_LINK_HERE>` to add your game to the yankee swap! Make sure not to let anyone else know about your gift though!",
};
const carson = {
    gameStart: "It's m-m-m-minecraft the movie time!",
    addGameTitlePrompt:
        "What is the name of the game? please don't list an exceptionally made minecraft film (as much as you may want to)",
    gameAdded: 'LOL that game is shit but okay :)',
    notEnoughPlayers: 'Bruh SFX #02... Not enough people :(',
    stealGiftPrompt: "It's splooge time. Who u tryna yoink from?",
    oneGamePerGamer: 'Whoawhoawhoa! Simmer down there, only one game per gamer :sunglasses:',
    pickGamePrompt: () => {
        const items = ['Which one of these u wanna open my guy?'];
        return items[Math.floor(Math.random() * items.length)];
    },
    pickActionPrompt: () => {
        const items = [
            'Stankle or Stunkle?',
            'Stanky or Wanky?',
            'Stinky or Stunky?',
            'I like big titty goth gf :)',
            'Stay or Stealy-wealy my big banana peely?',
        ];
        return items[Math.floor(Math.random() * items.length)];
    },
    youGotGame: (gameTitle: string) => `You got \`${gameTitle}\`. Peepee expanded by +1.`,
    gamerStoleGame: (from: User, to: User, gameTitle: string) =>
        `${to.toString()} totally ripped ${from.toString()}'s game right outta their hands and got ' \`${gameTitle}\``,
    gamerGotGame: (gamer: User, gameTitle: string) =>
        `${gamer.toString()} received \`${gameTitle}\`!\n..not that anyone cared..\n..or asked..`,
    theftMessageListTitle: 'These are the dirty amongers you can steal from:',
    addGameHelpMessage:
        "Welcome to Pogson's Poggy McWoggy Yankee Swap bot!\n\n DM me `!addgame <INSERT_GAME_CODE_HERE> <INSERT_GAME_LINK_HERE>` and I probably won't respond. If you care at all, make sure nobody know about your gift.",
};

const i18n = {
    en: en,
    carson: carson,
    default: carson,
};

export const messages = new I18nResolver(i18n, 'carson').translation;
