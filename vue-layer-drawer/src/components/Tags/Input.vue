<template>
  <input :type="element.attribute.type" :data-name="element.name" :style="element.style[$parent.gt_mediaName]" :id="element.attribute.id" :class="element.attribute.className" :placeholder="element.attribute.placeholder">
</template>

<script>
import { registerContextMenu } from "@/utils";
export default {
  name: "Input",
  data() {
    return {
      type: "input",
      icon: "input",
      name: "input-1",
      tagSort:700,
      attribute: {
        type: "text",
        id: "input-1",
        className: "input input-test",
        placeholder: "请输入..."
      },
      style: {
        default: {
          width: "120px",
          height: "30px",
          padding: "0 5px",
          border: "1px #ddd solid",
          "border-radius": "3px",
          color: "",
          "background-image": "url()",
          "background-color": "#fff",
          "background-repeat": "no-repeat",
          "background-size": "100% auto",
          "background-position": "left top"
        }
      }
    };
  },
  props: ["element"]
};
</script>
