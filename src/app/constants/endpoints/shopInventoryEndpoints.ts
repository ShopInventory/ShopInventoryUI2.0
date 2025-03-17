// import { empServiceUrls } from "./endpoints";
import { shopInventoryUrls } from "./endpoints";

export const shopInventoryEndpoints = {
      // save Data endpoints
    saveBrandDetails: `${shopInventoryUrls.shopInventory}saveBrandDetails`,
    saveCategoryDetails: `${shopInventoryUrls.shopInventory}saveCategoryDetails`,

    // get Data endpoints
    getCategoryDetails: `${shopInventoryUrls.shopInventory}getCategoryDetails`,
    getBrandDetails: `${shopInventoryUrls.shopInventory}getBrandDetails`,
  }
