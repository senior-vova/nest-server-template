import { Random6Code_V2 } from "./functions";

describe("Test random 6 digit code", () => {
  const numbers = "1234567890";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = Random6Code_V2();

  it("Code length should be 6 digits", () => {
    expect(code.length).toEqual(6);
  });

  it("Code should be include 2 letter and 4 number", () => {
    const list = code.split("");
    const lettersCount = list.filter((ch) => letters.includes(ch)).length;
    const numbersCount = list.filter((ch) => numbers.includes(ch)).length;

    expect(lettersCount).toEqual(2);
    expect(numbersCount).toEqual(4);
  });
});
