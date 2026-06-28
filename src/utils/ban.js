const userBucket = new Map();

export async function check(p, command) {
  const userId = p.user.id;

  // Owners bypass rate limits
  if (p.config.owner === userId) {
    return true;
  }

  const maxCommands = p.config.rateLimit?.maxCommands || 4;
  const windowMs = p.config.rateLimit?.windowMs || 6000;

  let bucket = userBucket.get(userId) || { count: 0, timer: null };

  if (!bucket.timer) {
    bucket.timer = setTimeout(() => {
      userBucket.delete(userId);
    }, windowMs);
  }

  bucket.count++;
  userBucket.set(userId, bucket);

  if (bucket.count > maxCommands) {
    // Only warn the user on the exact first excess command of the window
    if (bucket.count === maxCommands + 1) {
      p.error(', please slow down! You are sending commands too fast.', { ephemeral: true });
    }
    return false;
  }

  return true;
}
