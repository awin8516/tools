
import { Quill } from "vue-quill-editor";


const BlockEmbed = Quill.import("blots/block/embed");

class VideoBlot extends BlockEmbed {

  static create(src) {
    let node = super.create(src);
    node.setAttribute("frameborder", "0");
    node.setAttribute("allowfullscreen", true);
    node.setAttribute('data-src', src);
    node.setAttribute('src', src);
    node.setAttribute('scrolling', "no");
    node.setAttribute('class', "res_iframe card_iframe js_editor_card");

    return node;
  }

  static formats(node) {
    // We still need to report unregistered embed formats
    let format = {};
    if (node.hasAttribute("height")) {
      format.height = node.getAttribute("height");
    }
    if (node.hasAttribute("width")) {
      format.width = node.getAttribute("width");
    }
    return format;
  }

  static value(node) {
    return node.getAttribute("src");
  }

  format(name, value) {
    // Handle unregistered embed formats
    if (name === "height" || name === "width") {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name, value);
      }
    } else {
      super.format(name, value);
    }
  }
}
VideoBlot.blotName = "video";
VideoBlot.tagName = "iframe";

export default VideoBlot