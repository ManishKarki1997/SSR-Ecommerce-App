const toggleTheme = theme => {
  const themeToRemove = theme === "dark" ? "light" : "dark";
  window && window.localStorage.setItem("varya-commerce-theme", theme);
  document.body.classList.remove(themeToRemove);
  document.body.classList.add(theme);
};

export default toggleTheme;
