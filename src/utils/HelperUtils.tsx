import {SingleItem, Results} from '../interfaces/results';

class HelperUtils {
  static retrieveColorHex = (catID: string, cats: Results) => {
    let activeCat = cats.results.find((x) => x.id === catID);
    return activeCat?.meta.color;
  }
  static retrieveCategoryByID = (catID: string, cats: SingleItem[]) => {
    let activeCat = cats.find((x) => x.id === catID);
    return activeCat;
  };
}

export default HelperUtils;