//style 类型分类
const styleOptions = {
  select: {
    "background-attachment": ["inherit", "scroll", "fixed"],
    "background-position": ["top left", "top center", "top right", "center left", "center center", "center right", "bottom left", "bottom center", "bottom right"],
    "background-repeat": ["repeat", "repeat-x", "repeat-y", "no-repeat", "inherit"],
    "background-clip": ["border-box", "padding-box", "content-box"],
    "background-origin": ["padding-box", "border-box", "content-box"],
    "background-size": ["100% auto", "auto 100%", "100% 100%", "cover", "contain"],
    "overflow": ["visible", "hidden", "scroll", "auto", "no-display", "no-content"],
    "display": ["none ", " inline ", " block ", " list-item ", " inline-block ", " table ", " inline-table ", " table-caption ", " table-cell ", " table-row ", " table-row-group ", " table-column ", " table-column-group ", " table-footer-group ", " table-header-group ", " run-in ", " box ", " inline-box ", " flexbox ", " inline-flexbox ", " flex ", " inline-flex"],
    "float": ["none", "left", "right"],
    "clear": ["none", "left", "right", "both"],
    "visibility": ["visible", "hidden", "collapse"],
    "transform-origin": ["center center", "left top", "left center", "left bottom", "right top", "right center", "right bottom"],
    "transition-property": ["transform", "background-color", "background-image", "background-position", "border-bottom-color", "border-bottom-width", "border-color", "border-left-color", "border-left-width", "border-right-color", "border-right-width", "border-spacing", "border-top-color", "border-top-width", "border-width", "bottom", "color", "crop", "font-size", "font-weight", "height", "left", "letter-spacing", "line-height", "margin-bottom", "margin-left", "margin-right", "margin-top", "max-height", "max-width", "min-height", "min-width", "opacity", "outline-color", "outline-offset", "outline-width", "padding-bottom", "padding-left", "padding-right", "padding-top", "right", "text-indent", "text-shadow", "top", "vertical-align", "visibility", "width", "word-spacing", "z-index"],
    "transition-timing-function": ["ease", " linear", " ease-in", "ease-out", "ease-in-out", "step-start", "step-end"],
    "font-style": ["normal", "italic", "oblique"],
    "font-weight": ["normal", "bold", "bolder", "lighter"],
    "white-space": ["normal", "pre", "nowrap", "pre-wrap", "pre-line"],
    "word-break": ["normal", "keep-all", "break-all"],
    "word-wrap": ["normal", "break-word"],
    "overflow-wrap": ["normal", "break-word"],
    "text-align": ["start", "end", "left", "right", "center", "justify", "match-parent", "justify-all"],
    "vertical-align": ["baseline", "sub", "super", "top", "text-top", "middle", "bottom", "text-bottom"],
    "text-decoration": ["none", "underline", "overline", "line-through", "blink"],
    "appearance": ["none", "button"],
    "text-overflow": ["clip", "ellipsis"],
    "cursor": ["auto", "default", "none", "context-menu", "help", "pointer", "progress", "wait", "cell", "crosshair", "text", "vertical-text", "alias", "copy", "move", "no-drop", "not-allowed", "e-resize", "n-resize", "ne-resize", "nw-resize", "s-resize", "se-resize", "sw-resize", "w-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "col-resize", "row-resize", "all-scroll", "zoom-in", "zoom-out", "grab", "grabbing"],
    "box-sizing": ["content-box", "border-box"],
    "resize": ["none", "both", "horizontal", "vertical"],
    "user-select": ["none", "text", "all", "element"],
    "pointer-events": ["auto", "none", "visiblepainted", "visiblefill", "visiblestroke", "visible", "painted", "fill", "stroke", "all"],
    "list-style-type": ["disc", "circle", "square", "decimal", "lower-roman", "upper-roman", "lower-alpha", "upper-alpha", "none", "armenian", "cjk-ideographic", "georgian", "lower-greek", "hebrew", "hiragana", "hiragana-iroha", "katakana", "katakana-iroha", "lower-latin", "upper-latin"],
    "table-layout": ["auto", "fixed"],
    "border-collapse": ["separate", "collapse"],
    "position": ["static", "relative", "absolute", "fixed", "center", "page", "sticky"]
  },
  color: ["background-color", "color"],
  range: [
    "left",
    "top",
    "right",
    "bottom",
    "width",
    "height",
    "margin-left",
    "margin-top",
    "margin-right",
    "margin-bottom",
    "padding-left",
    "padding-top",
    "padding-right",
    "padding-bottom",
    "font-size",
    "line-height"
  ],
  upload:[
    "src","background-image"
  ]
}
export default styleOptions;

