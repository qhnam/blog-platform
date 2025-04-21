export class Utils {
  static generateRandomNumber(length: number) {
    let randomNumber = '';

    for (let i = 0; i < length; i++) {
      randomNumber += Math.floor(Math.random() * 10).toString();
    }

    return randomNumber;
  }
}
