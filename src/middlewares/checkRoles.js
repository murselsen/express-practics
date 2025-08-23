import { ROLES } from '../constants/index.js';
import createHttpError from 'http-errors';
import StudentsCollection from '../db/models/students.js';
export const checkRoles =
  (...roles) =>
  async (req, res, next) => {
    const { user } = req;

    if (!user) {
      next(createHttpError(401, 'Unauthorized'));
      return;
    }

    const { role } = user;
    console.log('User Data: ', user, ' Role: ', role);
    if (roles.includes(ROLES.TEACHER) && role === ROLES.TEACHER) {
      next();
      return;
    }

    if (roles.includes(ROLES.PARENT) && role === ROLES.PARENT) {
      const { studentId } = req.params;
      if (!studentId) {
        next(
          createHttpError(403, 'Parents can only access their own children')
        );
        return;
      }

      const student = await StudentsCollection.find({
        _id: studentId,
        parentId: user._id,
      });

      if (student) {
        next();
        return;
      }
    }

    next(createHttpError(403));
  };
