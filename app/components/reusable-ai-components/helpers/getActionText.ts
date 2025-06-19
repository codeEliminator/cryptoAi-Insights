import { LocalizationData } from "@/app/types/LocalizationData";

const getActionText = (action: string, locale: LocalizationData): string => {
  switch (action) {
    case 'buy': return locale.ai.actions.buy;
    case 'sell': return locale.ai.actions.sell;
    case 'hold': return locale.ai.actions.hold;
    default: return action;
  }
};

export default getActionText;