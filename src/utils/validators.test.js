import { isValidEmail } from './validators.js';

describe('isValidEmail', () => {
  const invalidCases = [
    'usuario@.com',
    'usuario@dominio..com',
    '@dominio.com',
    'usuario@',
    'usuario@@dominio.com',
    '',
    '   ',
    'sinArroba',
    'usuario@dominio',
  ];

  const validCases = [
    'usuario@dominio.com',
    'nombre.apellido@empresa.org',
    'user+tag@sub.dominio.io',
    'USER@DOMINIO.COM',
  ];

  test.each(invalidCases)('rechaza "%s"', (email) => {
    expect(isValidEmail(email)).toBe(false);
  });

  test.each(validCases)('acepta "%s"', (email) => {
    expect(isValidEmail(email)).toBe(true);
  });
});
