let main, client;

export function init(bot) {
  main = bot;
  client = bot.client;
}

export function getName(user) {
  return user?.globalName || user?.username || 'User';
}

export function getTag(user) {
  return `<@${user.id}>`;
}

export function toDiscordTimestamp(date, flag = 'R') {
  if (typeof date === 'number') {
    return `<t:${Math.trunc(date / 1000)}:${flag}>`;
  }
  return `<t:${Math.trunc(date.valueOf() / 1000)}:${flag}>`;
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function toFancyNum(num) {
  return num.toLocaleString();
}

export function toShortNum(num) {
  if (num >= 1000000) return Math.trunc(num / 1000000) + 'M';
  if (num >= 1000) return Math.trunc(num / 1000) + 'K';
  return num;
}

export function parseTime(diff) {
  let hours, minutes, seconds, text;
  if (diff > 1000 * 60 * 60) {
    hours = Math.floor(diff / (1000 * 60 * 60));
    diff %= 1000 * 60 * 60;
    minutes = Math.floor(diff / (1000 * 60));
    diff %= 1000 * 60;
    seconds = Math.ceil(diff / 1000);
    text = `**${hours}h ${minutes}m ${seconds}s**`;
  } else if (diff > 1000 * 60) {
    minutes = Math.floor(diff / (1000 * 60));
    diff %= 1000 * 60;
    seconds = Math.ceil(diff / 1000);
    text = `**${minutes}m ${seconds}s**`;
  } else {
    seconds = Math.ceil(diff / 1000);
    text = `**${seconds}s**`;
  }
  return { hours, minutes, seconds, text };
}
