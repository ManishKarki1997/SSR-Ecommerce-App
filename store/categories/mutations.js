const mutations = {
  SET_MINIMAL_CATEGORIES(state, categories) {
    state.minimalCategories = categories;
  },
  SET_ALL_CATEGORIES(state, categories) {
    const temp = state.allCategories || [];

    categories.forEach(c => {
      if (temp.length === 0) temp.push(c);

      if (!temp.find(x => x.name === c.name)) {
        temp.push(c);
      }
    });

    state.allCategories = temp;
  },
  ADD_NEW_CATEGORY(state, newCategory) {
    state.allCategories = state.allCategories
      ? [...state.allCategories, newCategory]
      : [newCategory];
  },
  UPDATE_CATEGORY(state, category) {
    state.allCategories = state.allCategories.map(c =>
      c.uid === category.uid ? category : c
    );
  },

  SET_SUBCATEGORIES(state, { categoryName, subCategories }) {
    if (!state.allSubcategories) {
      // no subcategories present (null), just set it
      state.allSubcategories = {
        [categoryName]: {
          categoryName,
          needToFetch: false,
          subCategories
        }
      };
    } else if (
      state.allSubcategories &&
      state.allSubcategories[categoryName] !== undefined
    ) {
      // the key with this categoryname exists, so append the subCategories to the existing
      state.allSubcategories = {
        ...state.allSubcategories,
        [categoryName]: {
          categoryName,
          needToFetch: false,
          subCategories: [
            ...state.allSubcategories[categoryName].subCategories,
            ...subCategories
          ]
        }
      };
    } else {
      // new entry to the object
      state.allSubcategories = {
        ...state.allSubcategories,
        [categoryName]: {
          categoryName,
          needToFetch: false,
          subCategories: [...subCategories]
        }
      };
    }

    // state.allSubcategories = state.allSubcategories
    //   ? [...state.allSubcategories, ...subCategories]
    //   : subCategories;
  },
  REMOVE_SUBCATEGORY(state, { categoryName, subCategory }) {
    state.allSubcategories[categoryName].subCategories = state.allSubcategories[
      categoryName
    ].subCategories.filter(x => x.uid !== subCategory.uid);
  },
  UPDATE_SUBCATEGORY(state, { subCategory, categoryName }) {
    if (subCategory.parentName !== categoryName) {
      // the category of the subcategory was changed

      // add subcategory to destined category's subcategories list
      const afterAdding =
        state.allSubcategories[subCategory.parentName] === undefined
          ? {
              needToFetch: true,
              categoryName: subCategory.parentName,
              subCategories: [subCategory]
            }
          : {
              needToFetch: false,
              categoryName: subCategory.parentName,
              subCategories: [
                ...(state.allCategories[subCategory.parentName]?.subCategories
                  ? state.allCategories[subCategory.parentName].subCategories
                  : []),
                subCategory
              ]
            };

      const filteredSubCategories = state.allSubcategories[
        categoryName
      ].subCategories.filter(x => x.uid !== subCategory.uid);

      const afterRemove = {
        categoryName,
        needToFetch: false,
        subCategories: filteredSubCategories
      };

      state.allSubcategories = {
        ...state.allSubcategories,
        [categoryName]: afterRemove,
        [subCategory.parentName]: afterAdding
      };
    } else {
      state.allSubcategories = {
        ...state.allSubcategories,
        [subCategory.parentName]: {
          category: subCategory.parentName,
          needToFetch: false,
          subCategories: state.allSubcategories[
            subCategory.parentName
          ]?.subCategories.map(x =>
            x.uid === subCategory.uid ? subCategory : x
          )
        }
      };
    }
  },
  ADD_NEW_SUBCATEGORY(state, subCategory) {
    if (state.allSubcategories[subCategory.parentName] === undefined) {
      state.allSubcategories = {
        ...state.allSubcategories,
        [subCategory.parentName]: {
          categoryName: subCategory.parentName,
          needToFetch: true,
          subCategories: [subCategory]
        }
      };
    } else {
      state.allSubcategories[subCategory.parentName].subCategories.push(
        subCategory
      );
    }
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
