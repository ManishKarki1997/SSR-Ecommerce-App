export default $axios => ({
  fetchAllFilters() {
    return $axios.get("filters", {
      withCredentials: true
    });
  },
  fetchFiltersForASubcategory(payload) {
    const { categoryName, subCategoryName } = payload;
    return $axios.get(
      `filters/single?categoryName=${categoryName}&subCategoryName=${subCategoryName}`,
      {
        withCredentials: true
      }
    );
  },
  createFilter(payload) {
    return $axios.post("filters", payload, {
      withCredentials: true
    });
  },
  updateFilter(payload) {
    return $axios.put("filters", payload, {
      withCredentials: true
    });
  }
});
