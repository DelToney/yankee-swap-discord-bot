import { Command, CommandMessage, Guard } from '@typeit/discord';
import { DMOnly } from '../guards/DMOnly';
import { Game } from '../util/stateManager';
import currentGameState from '../util/stateManager';
import { NotBot } from '../guards/NotBot';
import { PreGame } from '../guards/PreGame';
import { Unregistered } from '../guards/Unregistered';
import { Message, MessageCollector } from 'discord.js';
import { messages } from '../util/script.i18n';

export abstract class AddGame {
    @Command('addgame :gameKey  :gameLink')
    @Guard(DMOnly, NotBot, PreGame, Unregistered)
    async addGame(command: CommandMessage) {
        setTimeout(async () => {
            const { gameKey, gameLink } = command.args;
            const embeds = command.embeds;

            const newGameSubmission: Game = {
                gameKey,
                gameLink,
                claimed: false,
                gameTitle: '',
                donator: command.author,
                embed: embeds.length ? embeds[0] : null,
            };

            if (gameLink && gameLink.includes('store.steampowered')) {
                newGameSubmission.gameTitle = embeds[0].title;
                currentGameState.giftPool[command.author.id] = newGameSubmission;
                currentGameState.registeredGamers.push({
                    user: command.author,
                });
                command.reply(messages.gameAdded);
            } else {
                await command.channel.send(messages.addGameTitlePrompt); // PROMPT
                // maybe we find a way to not have this be an event handler but for right now we'll just use it
                const gameTitleCollector = await command.channel.createMessageCollector((m: Message) => !!m.content);
                gameTitleCollector.once('collect', (message: Message, user) => {
                    newGameSubmission.gameTitle = message.content;
                    currentGameState.giftPool[command.author.id] = newGameSubmission;
                    currentGameState.registeredGamers.push({
                        user: command.author,
                    });
                    command.reply(messages.gameAdded);
                    gameTitleCollector.stop('Title recieved');
                });
            }
        }, 2000);
    }
}
