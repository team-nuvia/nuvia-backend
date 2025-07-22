export const capitalize = (text: string) => {
  console.log('🚀 ~ capitalize ~ text:', text);
  return text.replace(/[\w]+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
};
