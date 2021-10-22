export default function({ store, redirect }) {
  if (process.client) {
    if (!window.localStorage.getItem("varya-commerce-loggedin")) {
      return redirect("/");
    }

    if (store.getters["auth/attemptedLogin"] && !store.getters["auth/user"]) {
      return redirect("/");
    }

    if (
      store.getters["auth/attemptedLogin"] &&
      store.getters["auth/user"] &&
      store.getters["auth/user"].role === "USER"
    ) {
      return redirect("/");
    }
  }
}
