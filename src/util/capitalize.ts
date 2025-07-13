export const capitalize = (text: string) => {
  return text.replace(/[\w]+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
};
