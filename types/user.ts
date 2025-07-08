export type UpdateEntry = {
  date: number;
  log: string;
  seen: boolean;
  id: string;
};

export interface UpdateList {
  entries: UpdateEntry[];
  push: (entry: UpdateEntry) => void;
}
export type Box = {
  id: string;
  from: string;
  to: string;
  received: boolean;
  data: {
    iv:string,
    data: string;
    key:string;
  };
  delivered_time: number;
  seen: boolean;
  tags:string[]
};
export interface User {
  name: string;
  address: string;
  username: string;
  image: string;
  bio: string;
  privateKey: string;
  publicKey: string;
  registeredDate: number;
  isArns: boolean;
  sent: number;
  received: number;
  mailBox: Array<Box>; 
  updates: Array<UpdateEntry>;
  draft: Array<Box>;
}
