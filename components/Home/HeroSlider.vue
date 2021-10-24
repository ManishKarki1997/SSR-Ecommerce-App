<template>
  <div>
    <client-only>
      <Flicking :options="options" :plugins="plugins">
        <div
          v-for="slide in slides"
          :key="slide.title"
          class="relative w-full overflow-hidden bg-transparent bg-center bg-cover rounded panel md:h-96"
        >
          <div class="absolute z-10 w-full h-full bg-black opacity-5 "></div>

          <div class="fixed z-50 w-full h-full">
            <div
              class="relative flex flex-col-reverse items-center justify-between w-full h-full md:flex-row"
            >
              <div class="w-full px-0 md:px-8 md:w-6/12 ">
                <h4 class="text-2xl font-bold md:text-4xl text-primary">
                  <!-- Exclusive New Generation Consoles -->
                  {{ slide.title }}
                </h4>
                <p class="my-3 font-normal text-secondary">
                  {{ slide.description }}

                  <!-- Playstation, XBox, Nintendo Switch and Steam Deck. Available
                  at affordable price. Don't miss out! -->
                </p>

                <p class="mb-6 ">
                  Starting from
                  <span class="text-3xl font-bold text-red-600">
                    <!-- $399 -->
                    {{ slide.price }}
                  </span>
                </p>

                <button
                  @click="$router.push(slide.link)"
                  class="px-4 py-2 text-white rounded bg-accent"
                >
                  Shop Now
                </button>
              </div>

              <div
                class="right-0 block w-full h-56 md:h-auto md:absolute md:w-7/12"
              >
                <img
                  data-not-lazy
                  class="object-cover w-full h-full"
                  :src="'/images/' + slide.imageName"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </Flicking>
    </client-only>
  </div>
</template>

<script>
import { Flicking } from "@egjs/vue-flicking";
import { AutoPlay } from "@egjs/flicking-plugins";
import Button from "../UI/Button.vue";

export default {
  components: {
    Flicking
  },
  data() {
    return {
      options: {
        align: "prev",
        circular: true,
        duration: 1500
        // interruptable: true
      },
      slides: [
        {
          title: "Exclusive New Generation Consoles",
          description: `
              Playstation, XBox, Nintendo Switch and Steam Deck. Available at affordable price. Don't miss out!
              `,
          price: "$399",
          link: "/categories/consoles",
          imageName: "playstation-5.png"
        },
        {
          title: "Brand New Gaming Laptops",
          description: `
              From world renouned brands like Asus, Dell, Acer, Razer and
                  more, available in all specs and models
              `,
          price: "$1399",
          link: "/categories/laptops",
          imageName: "zephyrus duo.png"
        },
        {
          title: "Amazing Smart Televisions",
          description: `
              4k, 8k LED, QLED smart television from trusted brands, in all
                  kinds of varietites and form factors
              `,
          price: "$999",
          link: "/categories/smart-devices/smart-tv-1IZZk_",
          imageName: "samsung tv.png"
        }
      ],
      plugins: [new AutoPlay()]
    };
  },
  methods: {}
};
</script>

<style>
@import url("node_modules/@egjs/vue-flicking/dist/flicking.css");
</style>

<style lang="scss" scoped>
.panel {
  @media (max-width: 361px) {
    height: 75vh;
  }
  @media (min-width: 361px) and (max-width: 420px) {
    height: 70vh;
  }
}
</style>
