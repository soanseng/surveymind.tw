import * as React from "react";
import useMediaQuery from "./useMediaQuery"; // Adjust the import path if necessary
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
  const ContentComponent = isDesktop ? DialogContent : DrawerContent;
  const HeaderComponent = isDesktop ? DialogHeader : DrawerHeader;
  const TitleComponent = isDesktop ? DialogTitle : DrawerTitle;
  const DescriptionComponent = isDesktop ? DialogDescription : DrawerDescription;
  const FooterComponent = isDesktop ? DialogFooter : DrawerFooter;
  const CloseComponent =  isDesktop ? DialogClose : DrawerClose;


  return { open, setOpen, TriggerComponent, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent  };
}

