function convertTextToNumbers(text: string): number[] {
  return text.split('').map((char) => +char);
}

export function isValidCPF(text: string): boolean {
  const document = text.replace(/[^\d]+/g, '');
  if (document.length !== 11 || !!document.match(/(\d)\1{10}/)) return false;
  const digits = convertTextToNumbers(document);
  const rest = (count: number): number => {
    const restSum = digits.slice(0, count - 12).reduce((total, el, i) => total + el * (count - i), 0);
    return ((restSum * 10) % 11) % 10;
  };
  return rest(10) === digits[9] && rest(11) === digits[10];
}
