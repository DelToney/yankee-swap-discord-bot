import { ArgsOf, GuardFunction } from "@typeit/discord";

export const NotBot = (text: string) => {
  const guard: GuardFunction = async (
    [message]: ArgsOf<"commandMessage">,
    client,
    on,
    next
  ) => {
    if (!message.author.bot) {
        await next();
    }
  };

  return guard;
};
