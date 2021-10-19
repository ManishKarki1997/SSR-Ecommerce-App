<template>
  <div>
    <table
      v-if="product"
      class="w-full text-left whitespace-no-wrap border-collapse table-auto sm:w-1/2 data-table bg-primary table-striped table-header--data"
    >
      <tbody class="w-full ">
        <tr
          v-for="specification in product.filters"
          :key="product.uid + '-specifications-' + specification.id"
        >
          <td class="px-4 py-2 font-semibold">{{ specification.name }}</td>
          <td class="px-4 py-2 ">{{ specification.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: false
    }
  }
};
</script>
