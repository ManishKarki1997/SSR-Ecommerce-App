<template>
  <client-only>
    <div v-if="editor" class="tiptapeditor">
      <div v-if="!displayMode" class="editor-buttons">
        <button aria-label="Add Image Button" @click="addImage">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style="width: 20px; height: 20px"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
        <button
          aria-label="Bold Button"
          :class="{ 'is-active': editor.isActive('bold') }"
          @click="
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          "
        >
          <Icon name="bold" />
        </button>
        <button
          aria-label="Italic Button"
          :class="{ 'is-active': editor.isActive('italic') }"
          @click="
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          "
        >
          <Icon name="italic" />
        </button>
        <button
          aria-label="Strike Button"
          :class="{ 'is-active': editor.isActive('strike') }"
          @click="
            editor
              .chain()
              .focus()
              .toggleStrike()
              .run()
          "
        >
          <Icon name="strikethrough" />
        </button>
        <button
          aria-label="Code Button"
          :class="{ 'is-active': editor.isActive('code') }"
          @click="
            editor
              .chain()
              .focus()
              .toggleCode()
              .run()
          "
        >
          <Icon name="chain" />
        </button>
        <button
          aria-label="Paragraph Button"
          :class="{ 'is-active': editor.isActive('paragraph') }"
          @click="
            editor
              .chain()
              .focus()
              .setParagraph()
              .run()
          "
        >
          <Icon name="paragraph" />
        </button>
        <button
          aria-label="Heading Level 1 Button"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          @click="
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 1 })
              .run()
          "
        >
          H1
        </button>
        <button
          aria-label="Heading Level 2 Button"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          @click="
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run()
          "
        >
          H2
        </button>
        <button
          aria-label="Heading Level 3 Button"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          @click="
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 3 })
              .run()
          "
        >
          H3
        </button>
        <button
          aria-label="Heading Level 4 Button"
          :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
          @click="
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 4 })
              .run()
          "
        >
          H4
        </button>
        <button
          aria-label="Heading Level 5 Button"
          :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
          @click="
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 5 })
              .run()
          "
        >
          H5
        </button>
        <button
          aria-label="Heading Level 6 Button"
          :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
          @click="
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 6 })
              .run()
          "
        >
          H6
        </button>
        <button
          aria-label="Bullet List Button"
          :class="{ 'is-active': editor.isActive('bulletList') }"
          @click="
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          "
        >
          <Icon name="list-check" />
        </button>
        <button
          aria-label="Ordered List Button"
          :class="{ 'is-active': editor.isActive('orderedList') }"
          @click="
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          "
        >
          <Icon name="list-ordered" />
        </button>
        <button
          aria-label="Code Block Button"
          :class="{ 'is-active': editor.isActive('codeBlock') }"
          @click="
            editor
              .chain()
              .focus()
              .toggleCodeBlock()
              .run()
          "
        >
          <Icon name="code" />
        </button>
        <button
          aria-label="Block Quote Button"
          :class="{ 'is-active': editor.isActive('blockquote') }"
          @click="
            editor
              .chain()
              .focus()
              .toggleBlockquote()
              .run()
          "
        >
          <Icon name="double-quotes" />
        </button>
        <button
          aria-label="Horizontal Rule Button"
          @click="
            editor
              .chain()
              .focus()
              .setHorizontalRule()
              .run()
          "
        >
          <Icon name="horizontal-rule" />
        </button>
        <button
          @click="
            editor
              .chain()
              .focus()
              .undo()
              .run()
          "
        >
          <Icon name="undo" />
        </button>
        <button
          aria-label="Redo Button"
          @click="
            editor
              .chain()
              .focus()
              .redo()
              .run()
          "
        >
          <Icon name="redo" />
        </button>

        <div class="block w-full table-buttons">
          <button
            aria-label="Insert Table Button"
            @click="
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            "
          >
            Insert Table
          </button>
          <button
            aria-label="Add Column Left Button"
            @click="
              editor
                .chain()
                .focus()
                .addColumnBefore()
                .run()
            "
            :disabled="!editor.can().addColumnBefore()"
          >
            Add Column Left
          </button>
          <button
            aria-label="Add Column Right Button"
            @click="
              editor
                .chain()
                .focus()
                .addColumnAfter()
                .run()
            "
            :disabled="!editor.can().addColumnAfter()"
          >
            Add Column Right
          </button>
          <button
            aria-label="Delete Column Button"
            @click="
              editor
                .chain()
                .focus()
                .deleteColumn()
                .run()
            "
            :disabled="!editor.can().deleteColumn()"
          >
            Delete Column
          </button>
          <button
            aria-label="Add Row Before Button"
            @click="
              editor
                .chain()
                .focus()
                .addRowBefore()
                .run()
            "
            :disabled="!editor.can().addRowBefore()"
          >
            Add Row Before
          </button>
          <button
            aria-label="Add Row Button"
            @click="
              editor
                .chain()
                .focus()
                .addRowAfter()
                .run()
            "
            :disabled="!editor.can().addRowAfter()"
          >
            Add Row After
          </button>
          <button
            aria-label="Delete Row Button"
            @click="
              editor
                .chain()
                .focus()
                .deleteRow()
                .run()
            "
            :disabled="!editor.can().deleteRow()"
          >
            Delete Row
          </button>
          <button
            aria-label="Delete Table Button"
            @click="
              editor
                .chain()
                .focus()
                .deleteTable()
                .run()
            "
            :disabled="!editor.can().deleteTable()"
          >
            Delete Table
          </button>
        </div>
      </div>
      <bubble-menu
        class="bubble-menu"
        :tippy-options="{ animation: false }"
        :editor="editor"
        v-if="editor && !displayMode"
        v-show="editor.isActive('custom-image')"
      >
        <button
          aria-label="Small Image Button"
          @click="
            editor
              .chain()
              .focus()
              .setImage({ size: 'small' })
              .run()
          "
          :class="{
            'is-active': editor.isActive('custom-image', {
              size: 'small'
            })
          }"
        >
          Small
        </button>
        <button
          aria-label="Medium Image Button"
          @click="
            editor
              .chain()
              .focus()
              .setImage({ size: 'medium' })
              .run()
          "
          :class="{
            'is-active': editor.isActive('custom-image', {
              size: 'medium'
            })
          }"
        >
          Medium
        </button>
        <button
          aria-label="Large Image Button"
          @click="
            editor
              .chain()
              .focus()
              .setImage({ size: 'large' })
              .run()
          "
          :class="{
            'is-active': editor.isActive('custom-image', {
              size: 'large'
            })
          }"
        >
          Large
        </button>
        <span style="color: #aaa">|</span>
        <button
          aria-label="Float Left Image"
          @click="
            editor
              .chain()
              .focus()
              .setImage({ float: 'left' })
              .run()
          "
          :class="{
            'is-active': editor.isActive('custom-image', {
              float: 'left'
            })
          }"
        >
          Left
        </button>
        <button
          aria-label="Float None Image"
          @click="
            editor
              .chain()
              .focus()
              .setImage({ float: 'none' })
              .run()
          "
          :class="{
            'is-active': editor.isActive('custom-image', {
              float: 'none'
            })
          }"
        >
          No float
        </button>
        <button
          aria-label="Float Right Button"
          @click="
            editor
              .chain()
              .focus()
              .setImage({ float: 'right' })
              .run()
          "
          :class="{
            'is-active': editor.isActive('custom-image', {
              float: 'right'
            })
          }"
        >
          Right
        </button>

        <span style="color: #aaa">|</span>
        <button aria-label="Change Button" @click="addImage">Change</button>
      </bubble-menu>
      <editor-content :editor="editor" class="editor" />
    </div>
  </client-only>
</template>

<script>
import { Editor, EditorContent, BubbleMenu } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import Icon from "@/components/UI/Icon";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import CustomImage from "@/extension/custom-tiptap-image";

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      // extend the existing attributes …
      ...this.parent?.(),

      // and add a new one …
      backgroundColor: {
        default: null,
        parseHTML: element => {
          return {
            backgroundColor: element.getAttribute("data-background-color")
          };
        },
        renderHTML: attributes => {
          return {
            "data-background-color": attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`
          };
        }
      }
    };
  }
});

export default {
  components: {
    EditorContent,
    Icon,
    BubbleMenu
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    displayMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editor: null
    };
  },
  watch: {
    value(value) {
      // HTML
      const isSame = this.editor.getHTML() === value;

      // JSON
      // const isSame = this.editor.getJSON().toString() === value.toString()
      if (isSame) {
        return;
      }

      this.editor.commands.setContent(this.value, false);
    }
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        CustomImage.configure({
          HTMLAttributes: {
            class: "custom-image"
          }
        }),
        Table.configure({
          resizable: true
        }),
        TableRow,
        TableHeader,
        // Default TableCell
        // TableCell,
        // Custom TableCell with backgroundColor attribute
        CustomTableCell
      ],
      // content: this.value,
      content: `<p>This text is <strong>read-only</strong>. No matter what you try, you are not able to edit something. Okay, if you toggle the checkbox above you’ll be able to edit the text.</p><p>If you want to check the state, you can call <code>editor.isEditable()</code>.</p><p></p><p><strong>This is a bold letter</strong></p><p></p><h1><strong>Heading 1</strong></h1><p></p><p>List of things to do</p><ul><li><p>first</p></li><li><p>second</p></li><li><p>third</p></li><li><p>fourth</p></li></ul><p></p><p></p><table><tbody><tr><th colspan="1" rowspan="1"><p>First</p></th><th colspan="1" rowspan="1"><p>Second</p></th><th colspan="1" rowspan="1"><p>Third</p></th></tr><tr><td colspan="1" rowspan="1" style="background-color: null"><p>hello</p></td><td colspan="1" rowspan="1" style="background-color: null"><p>there</p></td><td colspan="1" rowspan="1" style="background-color: null"><p>first</p></td></tr><tr><td colspan="1" rowspan="1" style="background-color: null"><p>what are</p></td><td colspan="1" rowspan="1" style="background-color: null"><p>you </p></td><td colspan="1" rowspan="1" style="background-color: null"><p>doing</p></td></tr></tbody></table><p></p><p>A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents.</p>
`,
      // editable: true,
      editable: this.displayMode,
      onUpdate: () => {
        // HTML
        this.$emit("input", this.editor.getHTML());

        // JSON
        // this.$emit('input', this.editor.getJSON())
      }
    });
  },
  methods: {
    addImage() {
      const url = window.prompt(
        "Image URL",
        // Using picsum.photo/id/... and NOT
        // picsum.photos/w/h or the image will
        // change when we change the size and
        // tiptap redraws
        `https://picsum.photos/id/${Math.floor(Math.random() * 200) +
          1}/200/300`
      );
      if (url) {
        this.editor
          .chain()
          .focus()
          .setImage({ src: url })
          .run();
      }
    }
  },
  beforeDestroy() {
    this.editor.destroy();
  }
};
</script>

<style lang="scss">
.editor-buttons {
  background-color: var(--primary-background);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 1rem;
  padding: 6px;
  border-bottom: 1px solid var(--border-color);

  button {
    background-color: transparent;
    margin-right: 8px;
    margin-bottom: 8px;
    border: none;
    color: var(--text-secondary);
    padding: 8px;

    &.is-active {
      background-color: var(--secondary-background);
      /* color: var(--btn-primary); */
    }
    svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
  }
}

.editor {
  min-height: 300px;
  border-radius: 5px;
  /* border: 1px solid var(--border-color); */

  ul {
    list-style-type: disc !important;
  }

  .ProseMirror {
    min-height: 300px;
    padding: 0;
  }
}

.ProseMirror table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 0;
  overflow: hidden;
}

.ProseMirror table td,
.ProseMirror table th {
  min-width: 1em;
  border: 2px solid #ced4da;
  padding: 3px 5px;
  vertical-align: top;
  box-sizing: border-box;
  position: relative;
}

.ProseMirror ul {
  padding: 0 1.2rem;
}

.ProseMirror {
  &:focus,
  &:active {
    outline: none;
  }
  > * + * {
    margin-top: 0.75em;
  }
  img {
    width: 100%;
    height: auto;
    display: block;
    margin-left: auto;
    margin-right: auto;
    &.ProseMirror-selectednode {
      outline: 3px solid #68cef8;
    }
  }
  .custom-image-small {
    max-width: 200px;
    max-height: 200px;
    object-fit: cover;
  }
  .custom-image-medium {
    max-width: 500px;
    max-height: 500px;
    object-fit: cover;
  }
  .custom-image-large {
    max-width: 100%;
    max-height: 900px;
    object-fit: cover;
  }
  .custom-image-float-none {
    float: none;
  }
  .custom-image-float-left {
    float: left;
    margin-right: 1rem;
  }
  .custom-image-float-right {
    float: right;
    margin-left: 1rem;
  }
  .custom-image-margin-small {
    margin: 2rem;
  }
}
.bubble-menu {
  display: flex;
  background-color: #0d0d0d;
  padding: 0.2rem;
  border-radius: 0.5rem;
  /* width: 700px !important; */
  min-width: 600px !important;

  & > * {
    margin: 0 8px;
  }

  button {
    border: none;
    background: none;
    color: var(--primary-background);
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0 0.2rem;
    opacity: 0.6;

    &:hover,
    &.is-active {
      opacity: 1;
    }
    &.is-active {
      text-decoration: underline;
    }
  }
}
</style>
