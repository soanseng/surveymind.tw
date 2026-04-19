import * as React from "react";
import useMediaQuery from "./useMediaQuery";
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

  const Content = isDesktop ? Dialog : Drawer;
  const TriggerComponent = isDesktop ? DialogTrigger : DrawerTrigger;
  const ContentComponent = isDesktop ? DialogContent : DrawerContent;
  const HeaderComponent = isDesktop ? DialogHeader : DrawerHeader;
  const TitleComponent = isDesktop ? DialogTitle : DrawerTitle;
  const DescriptionComponent = isDesktop ? DialogDescription : DrawerDescription;
  const FooterComponent = isDesktop ? DialogFooter : DrawerFooter;
  const BaseCloseComponent = isDesktop ? DialogClose : DrawerClose;

  const CloseComponent = React.useMemo(
    () =>
      React.forwardRef<any, any>(({ className, ...props }, ref) =>
        React.createElement(BaseCloseComponent, {
          ref,
          className: cn(className),
          ...props,
        }),
      ),
    [BaseCloseComponent],
  );

  CloseComponent.displayName = "ResponsiveDialogClose";

  return {
    open,
    setOpen,
    TriggerComponent,
    Content,
    ContentComponent,
    HeaderComponent,
    TitleComponent,
    DescriptionComponent,
    FooterComponent,
    CloseComponent,
  };
}
