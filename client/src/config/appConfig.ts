export interface AppConfig {
  appVersion: string;
  adminName: string;
  adminEmail: string;
  developerGithubURL: string;
}

export const appVersion: string = "1.0.0";
export const adminName: string = "Vishnu Thangaraj";
export const adminEmail: string = "vishnuthangaraj@hotmail.com";
export const developerGithubURL: string = "https://github.com/VishnuThangaraj";

export const appConfig: AppConfig = {
  appVersion,
  adminName,
  adminEmail,
  developerGithubURL,
};

export default appConfig;
