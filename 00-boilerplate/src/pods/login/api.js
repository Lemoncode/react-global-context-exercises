export const validateCredentials = (user, password) =>
  new Promise(resolve =>
    setTimeout(() => resolve(user === 'admin' && password === 'test'), 500)
  );
