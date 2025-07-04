import type React from "react"

action = "create"
description = "Create a new file to extend the JSX namespace for custom elements and attributes." // This file extends the global JSX namespace to add support for custom elements
// and attributes. TypeScript uses this namespace to type-check JSX syntax. [^1][^2]

// By adding declarations here, you can use non-standard elements and attributes
// in your .tsx files without getting type errors. This is particularly useful
// when integrating with libraries that use custom elements (like web components)
// or add custom attributes to the DOM.

// This file is automatically included by the TypeScript compiler because of the
// "include" setting in `tsconfig.json`.

declare namespace JSX {
  /**
   * The IntrinsicElements interface allows you to define custom elements
   * that TypeScript will recognize as valid JSX tags.
   */
  interface IntrinsicElements {
    /**
     * An example of a custom element. After this declaration, you can use
     * `<custom-element>` in your TSX files. The type definition specifies
     * the props it accepts, in this case, standard HTML attributes.
     */
    "custom-element": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
  }

  /**
   * This declaration merges with React's built-in HTMLAttributes to add
   * support for custom attributes on any standard HTML element.
   */
  interface HTMLAttributes<T> {
    /**
     * An example of a custom attribute. You can now use this attribute on any
     * standard HTML tag, e.g., `<div data-custom-attr="some-value">`.
     * It's a good practice to prefix custom attributes with `data-` to
     * comply with HTML standards.
     */
    "data-custom-attr"?: string
  }
}
