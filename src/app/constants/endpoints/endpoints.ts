import { environment } from "../../../environments/environment";

const shopInventoryBaseUrl = 'http://172.22.32.95:8080';

const devPorts: any = {
  'shop-inventory': ':8080',
}

const devUrls: any = {
  'shop-inventory': 'http://172.22.32.95:8080',
}


const getUrl = (serviceUrl: string) => {
  let url = '';
  let port = '';
  if (environment.envType === "DEV") {
    if (devUrls[serviceUrl]) {
      url = devUrls[serviceUrl];
    }
    if (devPorts[serviceUrl]) {
      port = devPorts[serviceUrl];
    }
    return `${url}${port}`
  }
  return shopInventoryBaseUrl;
}

export const shopInventoryUrls = {
  shopInventory: `${getUrl('shop-inventory')}/shopInventory/`,
}
