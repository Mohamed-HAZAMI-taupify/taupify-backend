module.exports = {
  inputSearch: async (list, attribut, argument) => {
    res = await list.filter(
      (el) =>
        el[attribut] &&
        el[attribut].toLowerCase().includes(argument.toLowerCase())
    );
    return res;
  },
};