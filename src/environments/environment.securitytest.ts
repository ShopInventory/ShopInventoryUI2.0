const baseUrlmst = "https://ifmstest.rajasthan.gov.in/employee/mst/v2.0/";
const envType = "SECURITYTEST";
const tokenList: any = [];
export const environment = {
  production: true,
  baseUrlmst: baseUrlmst,
  envType: envType,
  checkIfSecurityEnv: () => { },
  tokenList: tokenList
};
