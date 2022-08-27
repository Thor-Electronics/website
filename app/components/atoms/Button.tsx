// Styled components is better

import { ButtonHTMLAttributes, DetailedHTMLProps } from "react"

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: "sm" | "md" | "lg"
}

export default function Button({ children, className, ...props }: Props) {
  return (
    <button
      className={`btn text-white shadow-md py-1 px-3 rounded-md dark:highlight-white/5 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}