'use strict';

// format orchestrator errors
function formatError(e) {
  if (!e.error) {
    return e.message;
  }

  // PluginError
  if (typeof e.error.showStack === 'boolean') {
    return e.error.toString();
  }

  // normal error
  if (e.error.stack) {
    return e.error.stack;
  }

  // unknown (string, number, etc.)
  return new Error(String(e.error)).stack;
}

module.exports = formatError;
