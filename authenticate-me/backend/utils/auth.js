// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Membership, EventImage, Attendance } = require('../db/models');
const { Op } = require('sequelize');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  // Create the token.
  const token = jwt.sign(
    { data: user.toSafeObject() },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie('token', token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax"
  });

  return token;
};

const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.scope('currentUser').findByPk(id);
    } catch (e) {
      res.clearCookie('token');
      return next();
    }

    if (!req.user) res.clearCookie('token');

    return next();
  });
};

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
  if (req.user) return next();

  const err = new Error('Authentication required');
  err.title = 'Authentication required';
  err.errors = ['Authentication required'];
  err.status = 401;
  return next(err);
};

// check for organizer
function checkAuth(userId, otherId) {
  if (parseInt(userId) !== parseInt(otherId)) {
    const err = new Error('You are not the organizer of this group');
    err.status = 403;
    err.title = 'Forbidden';
    return err;
  }
  return true;
};

// check for cohost and organizer
async function checkCohost(userId, organizerId, groupId) {
  const organizerBool = parseInt(organizerId) === parseInt(userId);

  const cohosts = await Membership.findAll(({
    where: {
      userId,
      groupId,
      status: 'co-host'
    }
  }));

  if (organizerBool || cohosts.length) {
    return true;
  } else {
    const err = new Error('Must be a co-host or the organizer of this group to perform this action');
    err.status = 403;
    err.title = 'Forbidden';
    return err;
  }
};


// check for attendee
async function checkAttendance(userId, eventId) {
  const attendance = await Attendance.findAll({
    where: {
      userId,
      eventId,
      status: { [Op.in]: ['attending', 'member'] }
    }
  });

  if (!attendance.length) {
    return false;
  } else {
    return true;
  };
};


// check for deletion auth
async function deleteAuth(userId, groupOrganizerId, groupId, reqUserId) {
  const cohostBool = await checkCohost(userId, groupOrganizerId, groupId);
  const currUserBool = reqUserId === userId;

  if ((cohostBool instanceof Error) && (!currUserBool)) {
    const err = new Error('Deletion failed: Only the User or group organizer may perform this action');
    err.status = 403;
    return err;
  };

  return true;
};



module.exports = { setTokenCookie, restoreUser, requireAuth, checkAuth, checkCohost, checkAttendance, deleteAuth };
