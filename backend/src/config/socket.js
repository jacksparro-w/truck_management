let ioInstance;

const initializeSocket = (io) => {
  ioInstance = io;
};

const hasIO = () => Boolean(ioInstance);

const getIO = () => {
  if (!ioInstance) {
    throw new Error(
      "Socket.IO not initialized"
    );
  }

  return ioInstance;
};

module.exports = {
  initializeSocket,
  hasIO,
  getIO,
};

