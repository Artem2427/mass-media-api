export function randomCode(len: number): string {
  var code = '';

  for (let i = 0; i < len; i++) {
    var randomNumber = (Math.random() * 10) << 0;
    code += String.fromCharCode(
      (randomNumber += randomNumber > 9 ? (randomNumber < 36 ? 55 : 61) : 48),
    );
  }

  return code;
}
