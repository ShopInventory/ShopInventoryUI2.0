const baseUrlmst = "http://ifmsdev.rajasthan.gov.in/employee/mst/v2.0/";
const envType = "PROD";
const tokenList:any=[];

export const environment = {
  production: true,
  baseUrlmst: baseUrlmst,
  envType:envType,
  checkIfSecurityEnv:()=>{},
  tokenList:tokenList
};
