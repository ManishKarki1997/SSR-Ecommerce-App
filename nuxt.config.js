export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: true,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Varya Commerce | Electronics and Technology Shop",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "format-detection", content: "telephone=no" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },

      {
        rel: "stylesheet",

        href:
          "https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;400;500;600;700&display=swap"
      }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    `@/assets/css/tailwind.css`,
    `@/assets/css/typography.css`,
    `@/assets/css/variables.css`,
    `@/assets/css/common.scss`,
    `@/assets/css/products.scss`
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {
      src: "@/plugins/v-calendar.js",
      ssr: false
    },
    {
      src: "@/plugins/repository.js",
      ssr: false
    },
    {
      src: "@/plugins/tooltip.js",
      ssr: false
    },
    {
      src: "@/plugins/vue-range-slider.js",
      ssr: false
    },
    // {
    //   src: "@/plugins/editor.js",
    //   ssr:false,
    // },
    {
      src: "@/plugins/vuex-persist.js",
      ssr: false
    }
    // {
    //   src: "~/plugins/vue-editor.js",
    //   ssr: false
    // }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    "@nuxtjs/tailwindcss"
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
    "@nuxtjs/svg",
    "@nuxtjs/cloudinary",
    "nuxt-lazy-load"
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: "en"
    }
  },
  serverMiddleware: ["~/serverMiddleware/selectiveSSR.js"],
  axios: {
    baseURL: process.env.BACKEND_API_URL
    // baseURL: "http://localhost:4000/api/"
    // baseURL: "https://lyra-ecommerce-app.herokuapp.com/api/",
    // https: false
  },
  env: {
    PRESET_NAME: process.env.PRESET_NAME,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
  },
  cloudinary: {
    cloudName: process.env.CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    terser: {
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    },
    transpile: [
      "vue-upload-drop-images",
      "vee-validate",
      "vue-intersection-observer"
    ]
  }
};
