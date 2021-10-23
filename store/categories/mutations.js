const mutations = {
  SET_MINIMAL_CATEGORIES(state, categories) {
    state.minimalCategories = categories;
  },
  SET_ALL_CATEGORIES(state, categories) {
    const temp = state.allCategories || [];

    categories.forEach(c => {
      if (temp.length === 0) {
        temp.push(c);
        return;
      }

      if (!temp.find(x => x.uid === c.uid)) {
        temp.push(c);
      }
    });

    state.allCategories = temp;
  },

  REMOVE_SUBCATEGORY(state, { categoryName, subCategory }) {
    state.allSubcategories[categoryName].subCategories = state.allSubcategories[
      categoryName
    ].subCategories.filter(x => x.uid !== subCategory.uid);
  },

  // client
  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading || false;
  },
  SET_CATEGORIES(state, categories) {
    state.categories = categories;
  },
  ADD_CATEGORY_TO_DETAILED_CATEGORY(state, category) {
    if (state.detailedCategories[category.slug] === undefined) {
      state.detailedCategories[category.slug] = {
        ...category
      };
    } else {
      state.detailedCategories = {
        ...state.detailedCategories,
        [category.slug]: {
          ...category
        }
      };
    }
  }
};

export default mutations;
