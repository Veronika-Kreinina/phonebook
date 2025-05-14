import { Router } from 'express';
import { validateBody } from '../utils/validateBody.js';
import {
  registerShema,
  loginSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  confirmOauthSchema,
} from '../validation/auth.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginController,
  registerController,
  logoutController,
  refreshController,
  requestPasswordResetController,
  resetPasswordController,
  getOauthUrlController,
  confirmOauthController,
} from '../controllers/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerShema),
  ctrlWrapper(registerController),
);

authRouter.post(
  '/login',
  validateBody(loginSchema),
  ctrlWrapper(loginController),
);

authRouter.post('/logout', ctrlWrapper(logoutController));

authRouter.post('/refresh', ctrlWrapper(refreshController));

authRouter.post(
  '/send-reset-email',
  validateBody(requestPasswordResetSchema),
  ctrlWrapper(requestPasswordResetController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

authRouter.get('/get-oauth-url', ctrlWrapper(getOauthUrlController));

authRouter.post(
  '/confirm-oauth',
  validateBody(confirmOauthSchema),
  ctrlWrapper(confirmOauthController),
);

export default authRouter;
