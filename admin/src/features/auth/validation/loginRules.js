const loginRules = {
  email: {
    type: "email",
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  password: {
    type: "string",
    minLength: 6,
  },
};

export default loginRules;
