let client;

export function init(main) {
  client = main.client;
}

async function createMessage(interaction, content, options = {}) {
  const payload = typeof content === 'string' ? { content } : { ...content };
  if (options.ephemeral) {
    payload.ephemeral = true;
  }

  if (!interaction.replied && !interaction.deferred) {
    return interaction.reply(payload);
  } else if (interaction.deferred && !interaction.replied) {
    return interaction.editReply(payload);
  } else {
    return interaction.followUp(payload);
  }
}

export function send(interaction) {
  return function (content, options = {}) {
    return createMessage(interaction, content, options);
  };
}

export function error(interaction) {
  return function (content, options = {}) {
    const errorEmoji = interaction.client.bot?.config?.emoji?.error || '🚫';
    let tempContent = {};
    if (typeof content === 'string') {
      tempContent.content = `${errorEmoji} **|** ${content}`;
    } else {
      tempContent = { ...content };
      tempContent.content = `${errorEmoji} **|** ${content.content}`;
    }
    if (options.ephemeral === undefined) {
      options.ephemeral = true;
    }
    return createMessage(interaction, tempContent, options);
  };
}
