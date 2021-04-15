import { ArgsOf, GuardFunction } from '@typeit/discord';
import currentGameState from '../util/stateManager';

export const Unregistered = ([message]: ArgsOf<'commandMessage'>, client, next) => {
    if (currentGameState.giftPool.get(message.author.id)) {
        message.reply('Only one game per person!');
        return;
    } else {
        return next();
    }
};
