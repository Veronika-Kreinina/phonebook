import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/Session.js';

import { UserCollection } from '../db/models/User.js';

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (typeof authorization !== 'string') {
    return next(createHttpError.Unauthorized('Please provide access token'));
  }
  const [bearer, accessToken] = authorization.split(' ', 2);

  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    return next(createHttpError.Unauthorized('Please provide access token'));
  }

  const session = await SessionCollection.findOne({ accessToken });

  if (session === null) {
    return next(createHttpError.Unauthorized('Session not found'));
  }

  if (session.refreshTokenValidUntil < new Date()) {
    return next(createHttpError.Unauthorized('Access token is expired'));
  }
  const user = await UserCollection.findById(session.userId);

  if (user === null) {
    return next(createHttpError.Unauthorized('User not found'));
  }

  req.user = { id: user._id, name: user.name };

  next();
};
