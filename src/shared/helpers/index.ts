export const removeUndefined = (arr: any) => {
  for (const key in arr) {
    if (arr[key] === undefined) {
      delete arr[key];
    }
  }

  return arr;
};
