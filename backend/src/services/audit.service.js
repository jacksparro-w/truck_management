const prisma =
require("../config/prisma");

const createAuditLog =
async ({
  userId,
  action,
  entity,
  entityId,
  metadata = null,
}) => {

  try {

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        metadata,
      },
    });

  } catch (error) {

    console.error(
      "Audit log failed",
      error
    );
  }
};

module.exports = {
  createAuditLog,
};