export const MESSAGE = {
  SERVER_ERROR: `Server Error`,
  NOT_FOUND: (item: string) => `${item} is not found`,
  AUTH: {
    WRONG_LOGIN_OR_PASS: `Invalid email or password.`,
    WRONG_ATTEMPT_LEFT: (attempts: number) => `Wrong login or password. ${attempts} attempt left.`,
    TRY_LOGIN_AFTER: (minutes: number) => `Please try to login after ${minutes} minutes.`,
    IS_BLOCKED: `You're account is blocked.`,
    IS_NOT_ACTIVE: (email: string) =>
      `You're account is not activated. The code has been sent to your email: ${email}.`,
    CODE_SENT_TO_EMAIL: (email: string) => `The code has been sent to your email: ${email}.`,
    USER_IS_EXIST: `User with this email already exists.`,
    INCORRECT_EMAIL: `User is not found. Incorrect email.`,
    INCORRECT_CONFIRM_CODE: `Wrong code. Please try again.`,
  },
  USER: {},
};
