<template>
  <div class="flex flex-wrap items-center justify-between w-full mb-8">
    <p class="text-lg lg:text-lg md:text-lg">
      <slot name="left" />
    </p>

    <div>
      <slot name="right" />
    </div>
  </div>
</template>
