import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';
import createHttpError from 'http-errors';

import { createResponse } from '../utils/createResponse.js';
import { ONE_DAY } from '../constants/index.js';

export const registerUserController = async (req, res, next) => {
  try {
    const userData = req.body;
    const newUser = await registerUser(userData);
    if (!newUser) {
      throw createHttpError(400, 'User registration failed');
    }
    res.status(201).json(
      createResponse(
        true,
        'User registered successfully',
        {
          accessToken: newUser.accessToken,
        },
        201
      )
    );
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (req, res, next) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true, // Yalnızca web sunucusu tarafından erişilebilir
    expires: new Date(Date.now() + ONE_DAY), // expires in 1 day
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true, // Yalnızca web sunucusu tarafından erişilebilir
    expires: new Date(Date.now() + ONE_DAY), // expires in 1 day
  });
  res.status(200).json(
    createResponse(
      true,
      `User logged in successfully`,
      {
        accessToken: session.accessToken,
      },
      200
    )
  );
};

export const logoutUserController = async (req, res) => {
  try {
    if (req.cookies.sessionId) {
      await logoutUser(req.cookies.sessionId);
    }
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');
    console.log('Session cleared successfully');

    res.status(204).send();
  } catch (error) {
    throw createHttpError(400, 'No session found for logout');
  }
};

const setupSessionCookies = (res, session) => {
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const refreshUserSessionController = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;
    const session = await refreshUsersSession({
      sessionId,
      refreshToken,
    });

    setupSessionCookies(res, session);

    res.status(200).json(
      createResponse(true, 'Successfully refreshed a session!', {
        accessToken: session.accessToken,
      })
    );
  } catch (error) {
    next(createHttpError(401, 'Session refresh failed', error));
  }
};

export const requestResetEmailController = async (req, res, next) => {
  try {
    await requestResetToken(req.body.email);
    res
      .status(200)
      .json(
        createResponse(
          true,
          'Reset password email was successfully sent!',
          {},
          200
        )
      );
  } catch (error) {
    next(createHttpError(500, error));
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    await resetPassword(req.body);
    res
      .status(200)
      .json(createResponse(true, 'Password was successfully reset!', {}, 200));
  } catch (error) {
    next(createHttpError(500, error));
  }
};
