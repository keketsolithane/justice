export type User = {
  username: string;
  role: "admin" | "user";
};

export type DataRow = {
  id: number;
  [key: string]: any;
};
