// Suite smoke — tests que deben pasar en CUALQUIER versión soportada (v3.0.1+)
// NO incluir specs de features con "since" — esos van en regression.
// Los version guards dentro de cada spec manejan exclusiones automáticamente.
module.exports = [
  './tests/specs/auth/login.spec.js',
  './tests/specs/auth/resetPassword.spec.js',
  './tests/specs/onboarding/onboarding.spec.js',
  './tests/specs/home/home.spec.js',
];
