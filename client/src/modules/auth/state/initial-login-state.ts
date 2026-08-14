export interface InitialLoginState {
  userId: string;
  password: string;
}

const initialLoginState: InitialLoginState = { userId: "", password: "" };

export default initialLoginState;
