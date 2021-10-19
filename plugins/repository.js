import AuthService from "../store/auth/AuthServices";
import CategoryServices from "../store/categories/CategoryServices";
import ProductServices from "../store/products/ProductServices";
import FilterServices from "../store/filters/FilterService";

export default function({ $axios }, inject) {
  const AuthRepository = AuthService($axios);
  const CategoryRepository = CategoryServices($axios);
  const ProductRepository = ProductServices($axios);
  const FilterRepository = FilterServices($axios);

  inject("authRepository", AuthRepository);
  inject("categoryRepository", CategoryRepository);
  inject("productRepository", ProductRepository);
  inject("filterRepository", FilterRepository);
}
