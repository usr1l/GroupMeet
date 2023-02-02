const { User, EventImage, GroupImage } = require('../db/models');
const { Op } = require('sequelize');

function getDisplayDate(date) {
  const displayDate = date.toISOString().split('');
  displayDate.splice(10, 1, ' ');
  displayDate.splice(19, 5);

  return displayDate.join('');
};

function inputToDate(date) {
  const parts = date.split(' ');
  const dateParts = parts[ 0 ].split('-');
  const timeParts = parts[ 1 ].split(':');
  const newDate = new Date(dateParts[ 0 ], dateParts[ 1 ] - 1, dateParts[ 2 ], timeParts[ 0 ], timeParts[ 1 ], timeParts[ 2 ]);

  return newDate;
};

function toJSONDisplay(input, startField, endField) {
  const inputJSON = input.toJSON();

  inputJSON[ `${startField}` ] = getDisplayDate(inputJSON[ `${startField}` ]);
  inputJSON[ `${endField}` ] = getDisplayDate(inputJSON[ `${endField}` ]);

  return inputJSON;
};

async function checkUserId(reqUserId) {
  const userExists = await User.findByPk(reqUserId);

  if (!userExists) {
    const err = new Error('This user does not exist');
    err.status = 404;
    return err;
  };

  return true;
};

async function updateEventPreviewImage(eventId, previewImage) {
  const img = await EventImage.findOne({
    where: {
      [ Op.and ]: [ { eventId }, { preview: true } ]
    }
  });

  if (img) {
    const imgJSON = img.toJSON();
    const imgId = imgJSON.id;
    const currPreviewImg = await EventImage.findByPk(imgId);
    await currPreviewImg.update({
      preview: false
    });
  };

  return true;
};

async function updateGroupPreviewImage(groupId) {
  const img = await GroupImage.findOne({
    where: {
      [ Op.and ]: [ { groupId }, { preview: true } ]
    }
  });

  if (img) {
    const imgJSON = img.toJSON();
    const imgId = imgJSON.id

    const currPreviewImg = await GroupImage.findByPk(imgId);
    await currPreviewImg.update({
      preview: false
    });
  };
};



module.exports = {
  inputToDate,
  getDisplayDate,
  toJSONDisplay,
  checkUserId,
  updateEventPreviewImage,
  updateGroupPreviewImage
}
