import { ArgsOf, GuardFunction } from '@typeit/discord';
import currentGameState from '../util/stateManager';

export const GameNotStarted: GuardFunction = async ([message]: ArgsOf<'commandMessage'>, client, next) => {
    if (!currentGameState.begun) {
        await next();
    }
};
