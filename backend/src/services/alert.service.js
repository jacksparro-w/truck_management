const prisma =
  require("../config/prisma");

const {
  hasIO,
  getIO,
} = require("../config/socket");

const createAlert =
  async ({
    tripId,
    type,
    severity,
    title,
    message,
  }) => {

    const alert =
      await prisma.alert.create({
        data: {
          tripId,
          type,
          severity,
          title,
          message,
      },
      });

    if (hasIO()) {
      getIO().emit(
        "alert:new",
        alert
      );
    }

    return alert;
  };

module.exports = {
  createAlert,
};
