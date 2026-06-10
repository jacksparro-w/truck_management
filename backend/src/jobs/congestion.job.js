const cron =
  require("node-cron");

const {
  detectCongestion,
} = require(
  "../services/congestion.service"
);

const startCongestionJob =
  () => {

    cron.schedule(
      "*/30 * * * * *",
      async () => {

        console.log(
          "Running congestion detection..."
        );

        await detectCongestion();
      }
    );
  };

module.exports = {
  startCongestionJob,
};