<template>
  <component
    :is="iconComponent"
    class="fill-current icon"
    role="img"
    :style="`width:${size}px; height:${size}px`"
  />
</template>

<script>
const icons = {
  "secure-payment-line": require("../../assets/icons/secure-payment-line.svg?inline"),
  support: require("../../assets/icons/support.svg?inline"),
  money: require("../../assets/icons/money.svg?inline"),
  truck: require("../../assets/icons/truck.svg?inline"),
  coupon: require("../../assets/icons/coupon.svg?inline"),
  filter: require("../../assets/icons/filter.svg?inline"),
  pen: require("../../assets/icons/pen.svg?inline"),
  eye: require("../../assets/icons/eye.svg?inline"),
  refresh: require("../../assets/icons/refresh.svg?inline"),
  menu: require("../../assets/icons/menu.svg?inline"),
  user: require("../../assets/icons/user.svg?inline"),
  close: require("../../assets/icons/close.svg?inline"),
  edit: require("../../assets/icons/edit.svg?inline"),
  email: require("../../assets/icons/email.svg?inline"),
  bolt: require("../../assets/icons/bolt.svg?inline"),
  plus: require("../../assets/icons/plus.svg?inline"),
  minus: require("../../assets/icons/minus.svg?inline"),
  trash: require("../../assets/icons/trash.svg?inline"),
  moon: require("../../assets/icons/moon.svg?inline"),
  star: require("../../assets/icons/star.svg?inline"),
  starFill: require("../../assets/icons/star-fill.svg?inline"),
  sun: require("../../assets/icons/sun.svg?inline"),
  basket: require("../../assets/icons/basket.svg?inline"),
  category: require("../../assets/icons/category.svg?inline"),
  lock: require("../../assets/icons/lock.svg?inline"),
  error: require("../../assets/icons/error.svg?inline"),
  rename: require("../../assets/icons/rename.svg?inline"),
  images: require("../../assets/icons/images.svg?inline"),
  image: require("../../assets/icons/image.svg?inline"),
  heart: require("../../assets/icons/heart.svg?inline"),
  inbox: require("../../assets/icons/inbox.svg?inline"),
  search: require("../../assets/icons/search.svg?inline"),
  location: require("../../assets/icons/location.svg?inline"),
  cog: require("../../assets/icons/cog.svg?inline"),
  plane: require("../../assets/icons/plane.svg?inline"),
  "cart-outline": require("../../assets/icons/cart-outline.svg?inline"),
  "cart-fill": require("../../assets/icons/cart-fill.svg?inline"),
  "heart-fill": require("../../assets/icons/heart-fill.svg?inline"),
  "log-out": require("../../assets/icons/log-out.svg?inline"),
  "alert-circle": require("../../assets/icons/alert-circle.svg?inline"),
  "align-justify": require("../../assets/icons/align-justify.svg?inline"),
  "alert-triangle": require("../../assets/icons/alert-triangle.svg?inline"),
  "delivery-truck": require("../../assets/icons/delivery-truck.svg?inline"),
  "delivery-truck-error": require("../../assets/icons/delivery-truck-error.svg?inline"),
  "check-circle": require("../../assets/icons/check-circle.svg?inline"),
  "info-circle": require("../../assets/icons/info-circle.svg?inline"),
  "home-smile": require("../../assets/icons/home-smile.svg?inline"),
  "password-lock": require("../../assets/icons/password-lock.svg?inline"),
  "arrow-left": require("../../assets/icons/arrow-left.svg?inline"),
  "phone-call": require("../../assets/icons/phone-call.svg?inline"),
  "arrow-right": require("../../assets/icons/arrow-right.svg?inline"),
  "arrow-up": require("../../assets/icons/arrow-up.svg?inline"),
  "arrow-bottom": require("../../assets/icons/arrow-bottom.svg?inline"),
  "horizontal-menu": require("../../assets/icons/horizontal-menu.svg?inline"),
  "empty-white-box": require("../../assets/icons/empty-white-box.svg?inline"),

  // editor icons
  bold: require("../../assets/icons/editor/bold.svg?inline"),
  chain: require("../../assets/icons/editor/chain.svg?inline"),
  code: require("../../assets/icons/editor/code.svg?inline"),
  "double-quotes": require("../../assets/icons/editor/double-quotes.svg?inline"),
  history: require("../../assets/icons/editor/double-quotes.svg?inline"),
  "horizontal-rule": require("../../assets/icons/editor/double-quotes.svg?inline"),
  italic: require("../../assets/icons/editor/italic.svg?inline"),
  "list-check": require("../../assets/icons/editor/list-check.svg?inline"),
  "list-ordered": require("../../assets/icons/editor/list-ordered.svg?inline"),
  redo: require("../../assets/icons/editor/redo.svg?inline"),
  save: require("../../assets/icons/editor/save.svg?inline"),
  strikethrough: require("../../assets/icons/editor/strikethrough.svg?inline"),
  undo: require("../../assets/icons/editor/undo.svg?inline"),
  table: require("../../assets/icons/editor/table.svg?inline"),
  "arrow-to-top": require("../../assets/icons/editor/arrow-to-top.svg?inline"),
  "arrow-from-down": require("../../assets/icons/editor/arrow-from-down.svg?inline"),
  "table-left": require("../../assets/icons/editor/table-left.svg?inline"),
  "table-right": require("../../assets/icons/editor/table-right.svg?inline")
};

export default {
  props: {
    name: {
      type: String,
      // required: true,
      required: false
      // validator(value) {
      //   return Object.prototype.hasOwnProperty.call(icons, value);
      // }
    },
    size: {
      type: Number,
      default: 6
    }
  },

  computed: {
    iconComponent() {
      return icons[this.name];
    }
  }
};
</script>
