import { registerUser, loginUser, logoutUser } from '../services/auth.js';
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
    res
      .status(201)
      .json(createResponse(true, 'User registered successfully', newUser, 201));
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (req, res, next) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.session.refreshToken, {
    httpOnly: true, // Yalnızca web sunucusu tarafından erişilebilir
    expires: new Date(Date.now() + ONE_DAY), // expires in 1 day
  });

  res.cookie('sessionId', session.session._id, {
    httpOnly: true, // Yalnızca web sunucusu tarafından erişilebilir
    expires: new Date(Date.now() + ONE_DAY), // expires in 1 day
  });
  res.status(200).json(
    createResponse(
      true,
      'User logged in successfully',
      {
        user: session.user,
        // session: session.session,
        accessToken: session.session.accessToken,
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
    req.clearCookie('sessionId');
      req.clearCookie('refreshToken');
      
      
    res.status(204).send();
  } catch (error) {
    throw createHttpError(400, 'No session found for logout');
  }
};
