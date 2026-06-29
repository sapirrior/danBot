let _main;

export function init(main) {
  _main = main;
}

// ── Primary send helper ────────────────────────────────────────────────────────
// Returns a function bound to a specific Message object.
// Commands call: await p.send('hello')  or  await p.send({ embeds: [...] })

export function send(message) {
  return function (content, options = {}) {
    const payload = typeof content === 'string'
      ? { content, ...options }
      : { ...content, ...options };
    return message.channel.send(payload);
  };
}

// ── Error helper ───────────────────────────────────────────────────────────────
// Prepends the error emoji. By default does NOT ping the user (channel.send,
// not message.reply). Commands can call message.reply themselves when they
// want the reply-arrow UI.

export function error(message) {
  return function (content, options = {}) {
    const emoji = _main?.config?.emoji?.error ?? '🚫';
    const tag = `<@${message.author.id}>`;
    let text;
    if (typeof content === 'string') {
      text = `${emoji} **|** ${tag}${content}`;
    } else {
      const inner = content.content !== undefined ? content.content : '';
      text = `${emoji} **|** ${tag}${inner}`;
    }
    const payload = typeof content === 'string'
      ? { content: text, ...options }
      : { ...content, content: text, ...options };
    return message.channel.send(payload);
  };
}
