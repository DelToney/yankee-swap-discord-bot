import { ArgsOf, GuardFunction } from '@typeit/discord';
import { messages } from '../util/script.i18n';
import currentGameState from '../util/stateManager';

export const Unregistered = ([message]: ArgsOf<'commandMessage'>, client, next) => {
    if (currentGameState.giftPool[message.author.id]) {
        message.reply(messages.oneGamePerGamer);
        return;
    } else {
        return next();
    }
};
