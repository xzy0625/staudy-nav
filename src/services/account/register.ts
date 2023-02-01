import { getTCBInstance } from "@/utils/tcb";

interface IReister {
  username: string;
  password: string;
  phone: string;
  [props: string]: any;
}

const app = getTCBInstance()

export const register = ({ username, password, phone }: IReister) => {
  app.callFunction({
    name: 'register',
    
  })
  .then((res: any) => {
    console.log(`addComment succeed`, res);
    return res.result;
  })
}