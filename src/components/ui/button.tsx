
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 transform active:scale-95 active:brightness-90 touch-manipulation select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-3 py-2 text-sm sm:h-10 sm:px-4 sm:py-2 sm:text-base lg:h-12 lg:px-6 lg:py-3 lg:text-lg rounded-lg sm:rounded-xl lg:rounded-2xl [&_svg]:size-3 sm:[&_svg]:size-4 lg:[&_svg]:size-5",
        sm: "h-8 px-2 py-1.5 text-xs sm:h-9 sm:px-3 sm:py-2 sm:text-sm lg:h-10 lg:px-4 lg:py-2.5 lg:text-base rounded-md sm:rounded-lg lg:rounded-xl [&_svg]:size-3 sm:[&_svg]:size-3 lg:[&_svg]:size-4",
        lg: "h-10 px-4 py-2.5 text-base sm:h-12 sm:px-6 sm:py-3 sm:text-lg lg:h-14 lg:px-8 lg:py-4 lg:text-xl rounded-xl sm:rounded-2xl lg:rounded-3xl [&_svg]:size-4 sm:[&_svg]:size-5 lg:[&_svg]:size-6",
        icon: "h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-lg sm:rounded-xl lg:rounded-2xl [&_svg]:size-4 sm:[&_svg]:size-5 lg:[&_svg]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
