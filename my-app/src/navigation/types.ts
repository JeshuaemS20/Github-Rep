export type RootStackParamList = {
  Login: undefined;
  Calculator: undefined;
  AITutor: {
    prompt: string;
  };
  UserSaveInfo: {
    calculations: { expression: string; result: string }[];
    latestDisplay: string;
  };
};