module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundColor: {
        primary: "var(--primary-background)",
        secondary: "var(--secondary-background)",
        tertiary: "var(--tertiary-background)",
        accent: "var(--accent-background)",

        btnPrimary: "var(--btn-primary)",
        btnWarning: "var(--btn-warning)",
        btnDanger: "var(--btn-danger)",
        btnDark: "var(--btn-dark)"
      },
      textColor: {
        primary: "var(--primary-text)",
        secondary: "var(--secondary-text)",
        tertiary: "var(--tertiary-text)",
        accent: "var(--accent-text)",
        primaryTextOpposite: "var(--primary-text-opposite)",
        primaryBgText: "var(--primary-bg-text)"
      }
    }
  },
  variants: {
    extend: {
      translate: ["group-hover"],
      transform: ["group-hover"],
      opacity: ["group-hover"],
      display: ["group-hover"],
      scale: ["group-hover", "hover"],
      visibility: ["hover", "group-hover"],
      textColor: ["group-hover", "hover"],
      borderColor: ["hover", "focus"]
    }
  },
  plugins: []
};
