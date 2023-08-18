export type Paginate<T> = {
  nextPag: string | number;
  prevPag: string | number;
  count: number;
  results: Array<T>;
};
