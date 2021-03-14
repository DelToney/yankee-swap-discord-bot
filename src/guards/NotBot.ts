import { ArgsOf, GuardFunction } from '@typeit/discord';

export const NotBot: GuardFunction = async ([message]: ArgsOf<'commandMessage'>, client, next) => {
    if (!message.author.bot) {
        await next();
    }
};
