export const DynamicNaming = (constructor: any) => {
  return (target: any) => {
    target.name = constructor.name;
  };
};
