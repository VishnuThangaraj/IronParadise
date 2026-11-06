interface LoginRules {
  userId: object;
  password: object;
}

const loginRules: LoginRules = {
  userId: {
    type: "string",
    minLength: 7,
    maxLength: 12,
  },
  password: {
    type: "string",
    minLength: 6,
  },
};

export default loginRules;
