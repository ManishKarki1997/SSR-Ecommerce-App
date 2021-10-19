<template>
  <div>
    <div>
      <TiptapEditor :editable="editable" v-model="product.editorDescription" />
    </div>
    <!-- <editor ref="editor" :config="config" />
    <button @click="invokeSave">Save</button> -->
  </div>
</template>

<script>
import TiptapEditor from "@/components/Common/Editor.vue";

export default {
  props: {
    product: {
      type: Object,
      required: true
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  components: {
    TiptapEditor
  },
  data() {
    return {
      content: "<h2>I am Example</h2>",
      config: {
        data: {
          time: 1633274593523,
          blocks: [
            {
              id: "xfD_gGgz0D",
              type: "list",
              data: {
                style: "ordered",
                items: ["first", "second", "third"]
              }
            },
            {
              id: "fTzBerGRf6",
              type: "paragraph",
              data: {
                text:
                  "A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents."
              }
            },
            {
              id: "jtIe6Cww3F",
              type: "table",
              data: {
                withHeadings: false,
                content: [
                  ["specifications", "value"],
                  ["Brand", "Samsung"],
                  ["Color", "Black"]
                ]
              }
            }
          ],
          version: "2.22.2"
        },
        minHeight: 0
      }
    };
  },

  mounted() {},
  methods: {
    invokeSave() {
      this.$refs.editor._data.state.editor
        .save()
        .then(data => {
          // Do what you want with the data here
          console.log(data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss"></style>
