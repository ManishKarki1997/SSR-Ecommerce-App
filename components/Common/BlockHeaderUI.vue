<template>
  <div class="flex flex-wrap items-center justify-between w-full mb-4">
    <p class="text-lg lg:text-xl md:text-xl">
      <slot name="left" />
    </p>

    <div>
      <slot name="right" />
    </div>
  </div>
</template>
