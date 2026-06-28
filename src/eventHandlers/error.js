export function handle(err) {
  this.logger.error(`Discord Client Error: ${err.stack || err}`);
}
