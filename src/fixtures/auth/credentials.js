const required = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Variable de entorno requerida no definida: ${key}. Revisá tu archivo .env`);
  return value;
};

module.exports = {
  validUser: {
    email:    required('TEST_USER_EMAIL'),
    password: required('TEST_USER_PASSWORD'),
  },
};
