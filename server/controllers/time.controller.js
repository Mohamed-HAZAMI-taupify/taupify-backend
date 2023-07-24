module.exports = {
  timeController: (time) => {
    try {
      return time
        .toISOString()
        .replace(/\.\d+Z/, "Z")
        .replace(/\:\d+Z/, "Z");
    } catch (err) {
      console.log(err);
    }
  },
};
