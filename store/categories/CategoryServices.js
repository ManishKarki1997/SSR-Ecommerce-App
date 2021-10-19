import { generateUrl } from "@/utils";

export default $axios => ({
  fetchHeaderCategories() {
    return $axios.get("categories/headerCategories");
  },
  fetchCategories(payload) {
    const url = generateUrl("categories", payload);

    return $axios.get(url);
  },
  fetchSingleCategory({ slug, includeProducts = true }) {
    const url = `categories/single/${slug}?includeProducts=${includeProducts}`;
    return $axios.get(url);
  },
  fetchMinimalCategories(payload) {
    let url = "";
    if (payload) {
      const { includeSubCategories } = payload;
      if (includeSubCategories) {
        url = `categories/minimalCategories?includeSubCategories=true`;
      }
    } else {
      url = `categories/minimalCategories`;
    }

    return $axios.get(url);
  },
  fetchSubcategoriesForACategory(payload) {
    const name = `categories/subcategories/${payload.categoryName}`;

    const temp = { ...payload };
    delete temp.categoryName;

    const url = generateUrl(name, temp);

    return $axios.get(url);
  },
  createCategory(payload) {
    return $axios.post("/categories", payload, {
      withCredentials: true
    });
  },
  updateCategory(payload) {
    return $axios.put("/categories", payload, {
      withCredentials: true
    });
  }
});
