import { isValidEmail } from '../utils/validators.js';

/**
 * Express middleware — validates email field in req.body.
 * Responds 422 if invalid so the fix covers both frontend and backend (closes #1).
 */
export function validateEmailMiddleware(req, res, next) {
  const { email } = req.body;
  if (!isValidEmail(email)) {
    return res.status(422).json({ error: 'El formato del email no es válido' });
  }
  next();
}
