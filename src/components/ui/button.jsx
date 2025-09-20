import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft hover:shadow-glow transition-smooth",
        hero: "bg-gradient-hero text-white hover:scale-105 shadow-glow transition-bounce",
        warm: "bg-gradient-warm text-white hover:scale-105 shadow-soft transition-bounce",
        cool: "bg-gradient-cool text-white hover:scale-105 shadow-soft transition-bounce",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-soft transition-smooth",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft transition-smooth",
        outline: "border border-border bg-background hover:bg-muted hover:text-muted-foreground transition-smooth",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-soft transition-smooth",
        ghost: "hover:bg-muted hover:text-muted-foreground rounded-xl transition-smooth",
        link: "text-primary underline-offset-4 hover:underline transition-smooth",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };