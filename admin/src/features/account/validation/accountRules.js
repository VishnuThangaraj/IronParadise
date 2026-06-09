const accountRules = {
  name: {
    type: "string",
    maxLength: 50,
  },
  email: {
    type: "email",
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  phone: {
    type: "string",
    pattern: /^\+?[0-9\s()-]{7,20}$/,
  },
  current: {
    type: "string",
    minLength: 6,
  },
  new: {
    type: "string",
    minLength: 6,
  },
  confirm: {
    type: "string",
    minLength: 6,
  },
};

export default accountRules;
