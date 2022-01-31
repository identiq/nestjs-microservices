export const snakeCase = (str?: string) =>
  ((str && str[0].toLowerCase() + str.slice(1)) || '').replace(
    /[A-Z]/g,
    (letter: string) => `_${letter.toLowerCase()}`
  );
