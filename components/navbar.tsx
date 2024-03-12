'use client'
import Link from 'next/link';
import {useState} from 'react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"



const Navbar = () => {
  const [isOpen, setIsOpen ] = useState(false);
  const categories = [
    { name: '情緒', questionnaire: [ {name: '廣泛性焦慮量表', link: '/gad'}, {name: 'PHQ-9 憂鬱症篩檢問卷', link: '/phq-9'}, {name: '台灣人憂鬱症量表', link:'/tdq'} ] },
    { name: '睡眠', questionnaire: [ {name: 'PSQI 匹茲堡睡眠品質量表', link: '/psqi'} ] },
    { name: '注意力不集中', questionnaire: [ {name: 'ASRS 成人ADHD自我評估問卷', link:'/asrs'} ] },
    { name: '失智', questionnaire: [ {name: 'MMSE', link: '/mmse'} ] }, // Add links as needed
    { name: '人格', questionnaire: [ {name: '大五人格量表', link: '/big-5'} ] }, // Add links a
  ];

  return (
    <div>
      {/* Desktop Menubar */}
      <div className="hidden md:block">
        <Menubar>
          {categories.map((category) => (
            <MenubarMenu key={category.name}>
              <MenubarTrigger>{category.name}</MenubarTrigger>
              <MenubarContent>
                {category.questionnaire.map((questionnaire, index) => (
                  <MenubarItem key={index}>
                    <Link href={questionnaire.link}>{questionnaire.name}</Link>
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
          ))}
        </Menubar>
      </div>

        {/* Mobile Dropdown Menu */}
        <div className="md:hidden">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
            <HamburgerMenuIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {categories.map((category) => (
            <DropdownMenuSub key={category.name}>
              <DropdownMenuSubTrigger>{category.name}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {category.questionnaire.map((questionnaire, index) => (
                  <DropdownMenuItem key={index}>
                    <Link href={questionnaire.link}>{questionnaire.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    </div>
  )
};

export default Navbar;