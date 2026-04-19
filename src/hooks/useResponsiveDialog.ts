import * as React from "react";
import useMediaQuery from "./useMediaQuery"; // Adjust the import path if necessary
import PrintButton from "@/components/PrintButton";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
  } from "@/components/ui/dialog";
  import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
  } from "@/components/ui/drawer";

export function useResponsiveDialog() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Components
  const Content = isDesktop ? Dialog : Drawer;
  const TriggerComponent = isDesktop ? DialogTrigger : DrawerTrigger;
  const BaseContentComponent = isDesktop ? DialogContent : DrawerContent;
  const HeaderComponent = isDesktop ? DialogHeader : DrawerHeader;
  const TitleComponent = isDesktop ? DialogTitle : DrawerTitle;
  const DescriptionComponent = isDesktop ? DialogDescription : DrawerDescription;
  const BaseFooterComponent = isDesktop ? DialogFooter : DrawerFooter;
  const BaseCloseComponent =  isDesktop ? DialogClose : DrawerClose;

  // `data-print-root` marks this surface as the print target. src/lib/print.ts
  // walks up from the PrintButton to the nearest [data-print-root] and clones
  // that subtree into document.body for printing. Every questionnaire that
  // uses this hook gets printing for free.
  const ContentComponent = React.useMemo(
    () =>
      React.forwardRef<any, any>(({ className, ...props }, ref) =>
        React.createElement(BaseContentComponent, {
          ref,
          "data-print-root": true,
          className,
          ...props,
        }),
      ),
    [BaseContentComponent],
  );

  const FooterComponent = React.useMemo(
    () =>
      ({
        children,
        className,
        disablePrint = false,
        ...props
      }: React.HTMLAttributes<HTMLDivElement> & { disablePrint?: boolean }) =>
        React.createElement(
          BaseFooterComponent,
          { className, ...props },
          !disablePrint ? React.createElement(PrintButton, { className: "w-full sm:w-auto" }) : null,
          children,
        ),
    [BaseFooterComponent],
  );

  const CloseComponent = React.useMemo(
    () =>
      React.forwardRef<any, any>(({ className, ...props }, ref) =>
        React.createElement(BaseCloseComponent, {
          ref,
          className: cn("print:hidden", className),
          ...props,
        }),
      ),
    [BaseCloseComponent],
  );

  ContentComponent.displayName = "ResponsiveDialogContent";
  CloseComponent.displayName = "ResponsiveDialogClose";


  return { open, setOpen, TriggerComponent, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent  };
}
