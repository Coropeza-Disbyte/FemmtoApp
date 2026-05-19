/**
 * Compares two version strings (major.minor.patch).
 * Returns true if a < b.
 */
function versionLt(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na < nb) return true;
    if (na > nb) return false;
  }
  return false;
}

/**
 * Returns true if APP_VERSION env var is set and is lower than requiredVersion.
 * Use inside a Mocha `before()` hook to skip a describe block:
 *
 *   before(function () { if (skipIfBefore('3.6.0')) this.skip(); });
 *
 * When APP_VERSION is not set, always returns false (all tests run).
 */
function skipIfBefore(requiredVersion) {
  const appVersion = process.env.APP_VERSION;
  if (!appVersion) return false;
  return versionLt(appVersion, requiredVersion);
}

module.exports = { skipIfBefore };
