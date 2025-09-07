export const fakeUsersDB = [
  { email: "mujeebsyed275@gmail.com", password: "1234", name: "Admin User" },
];

export const fakeLoginApi = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = fakeUsersDB.find(
        (u) => u.email === email && u.password === password
      );
      if (user) {
        const fakeToken = "mocked-jwt-token-123456";
        resolve({
          token: fakeToken,
          user: { name: user.name, email: user.email },
        });
      } else {
        reject("Invalid email or password");
      }
    }, 1000);
  });
};

export const fakeSignupApi = ({ name, email, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingUser = fakeUsersDB.find((u) => u.email === email);
      if (existingUser) {
        reject("User already exists");
      } else {
        const newUser = { name, email, password };
        fakeUsersDB.push(newUser);
        const fakeToken = "mocked-jwt-token-78910";
        resolve({ token: fakeToken, user: { name, email } });
      }
    }, 1000);
  });
};
