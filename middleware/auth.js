export default function({ store, redirect }) {
  if (
    process.client &&
    (!store.getters["auth/user"] ||
      (store.getters["auth/user"] &&
        store.getters["auth/user"].role === "USER"))
  )
    return redirect("/");
}
