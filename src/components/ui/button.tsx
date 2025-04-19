import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import gsap from "gsap";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 cursor-pointer relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type MotionProps = React.ComponentProps<typeof motion.button>;
type HTMLButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & MotionProps & HTMLButtonProps
>(({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
  const Comp = asChild ? Slot : motion.button;

  const button = React.useRef<HTMLButtonElement>(null);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const { clientX, clientY } = event;
    const {
      x: buttonX,
      y: buttonY,
      width,
      height,
    } = button?.current?.getBoundingClientRect() as any;

    const perspective = document.createElement("span");
    const backgroundClass =
      variant === "default" || variant === undefined
        ? "bg-white/30"
        : variant === "secondary" || variant === "outline"
        ? "bg-neutral-500/30"
        : variant === "destructive"
        ? "bg-white/30"
        : variant === "ghost"
        ? "bg-neutral-500/30"
        : variant === "link" && "";


    perspective.className = `absolute left-0 top-0 pointer-events-none rounded-full opacity-0 ${backgroundClass}`;

    button.current?.appendChild(perspective);

    gsap.set(perspective, {
      width: Math.max(width, height) / 2,
      height: Math.max(width, height) / 2,
      scale: 0,
      opacity: 0.75,
      x: clientX - buttonX,
      y: clientY - buttonY,
      xPercent: -50,
      yPercent: -50,
    });

    gsap.to(perspective, {
      scale: 5,
      opacity: 0,
      duration: 1,
      onComplete: () => {
        perspective.remove();
      },
    });
  }

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={(ef: any) => {
        //@ts-ignore
        button.current = ef;
        ref && typeof ref === "function" && ref(ef);
      }}
      {...props}
      onClick={(e: any) => {
        onClick && onClick(e);
        handleClick(e);
      }}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
