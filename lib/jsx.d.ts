import type React from "react"
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "custom-element": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "data-custom-attr"?: string
      }
    }

    interface HTMLAttributes<T> {
      "data-custom-attr"?: string
    }
  }
}
