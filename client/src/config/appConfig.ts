export interface AppConfig {
  appVersion: string;
  developerName: string;
  developerEmail: string;
  developerGithubURL: string;
}

export const appVersion: string = "V3.1.0";
export const developerName: string = "Vishnu Thangaraj";
export const developerEmail: string = "vishnuthangaraj@hotmail.com";
export const developerGithubURL: string = "https://github.com/VishnuThangaraj";

export const appConfig: AppConfig = {
  appVersion,
  developerName,
  developerEmail,
  developerGithubURL,
};

export default appConfig;
