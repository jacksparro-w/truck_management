const toJsonSafe = (value) =>
  JSON.parse(
    JSON.stringify(
      value,
      (_, currentValue) =>
        typeof currentValue === "bigint"
          ? currentValue.toString()
          : currentValue
    )
  );

module.exports = {
  toJsonSafe,
};
