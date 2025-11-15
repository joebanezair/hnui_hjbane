import { Button, ButtonGroup } from "@heroui/button";
import { Link } from "@heroui/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { siteConfig } from "../config/site";
import { Logo } from "./icons";
import { BellRing, Home, ListTodo, MapPin, MessageCircle, TextSearch, UserRound, UserRoundPen } from "lucide-react";
import { User } from "@heroui/user";
import { Avatar } from "@heroui/avatar";
import { Tooltip } from "@heroui/tooltip";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";

export const AcmeLogo = () => {
    return (
        <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
            <path
                clipRule="evenodd"
                d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </svg>
    );
}; 

const LogoComponent = (
    <div className="flex flex-row gap-0 items-center">
      
        {/* Mobile version: visible on small screens only */}
        <div className="flex sm:hidden">
            <Button
                variant="ghost"
                color="primary"
                radius="sm"
                id="MainLogoHustla"
                isIconOnly
                size="sm"
                style={{ borderWidth: 0 }}
            >
                <AcmeLogo />
            </Button>
        </div>

        {/* Desktop version: visible on sm+ screens */}
        <div className="hidden sm:flex">
            <Button
                variant="ghost"
                color="primary"
                radius="full"
                id="MainLogoHustla"
                size="sm"
                style={{ paddingLeft: 5, paddingRight: 13, border: "none" }}
            >
                <AcmeLogo />
                <p className="font-bold text-inherit text-sm" style={{ marginLeft: -8 }}>{siteConfig.name}</p>
            </Button>
        </div>
    </div>
);

const ProFile = (<>
    <Avatar isBordered
        style={{ cursor: "pointer" }} size="sm" color="primary" src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
</>);

const navItems = [
    { icon: <Home />, active: false, toolTip: "Home" },
    { icon: <MessageCircle />, active: false, toolTip: "Messages" },
    { icon: <MapPin />, active: true, toolTip: "Task Map" },   // mark active
    { icon: <ListTodo />, active: false, toolTip: "TO-DO" },
    { icon: <BellRing />, active: false, toolTip: "Notifications" },
];
const navItemsSmallScreen = [
    { icon: <Home />, active: false, toolTip: "Home" },
    { icon: <MapPin />, active: true, toolTip: "Task Map" },   // mark active
    { icon: <BellRing />, active: false, toolTip: "Notifications" },
    { icon: <ListTodo />, active: false, toolTip: "TO-DO" },
    { icon: <UserRoundPen />, active: false, toolTip: "Profile" }
];

const rightItems = [
    { icon: <UserRoundPen />, active: false, toolTip: "Profile" },
];

const MainNavigation = (<>
    <NavbarContent className="hidden sm:flex gap-10" justify="start">
        {navItems.map((item, index) => (
            <NavbarItem key={index} isActive={item.active}>
                <Tooltip content={item.toolTip} placement="bottom">
                    <Button
                        color="primary"
                        radius="md"
                        size="sm"
                        className="border-none"
                        variant="ghost"
                        isIconOnly
                        style={{ padding: 7 }}
                    >
                        {item.icon}
                    </Button>
                </Tooltip>
            </NavbarItem>
        ))}
    </NavbarContent>
    <NavbarContent className="w-full flex sm:hidden" justify="center">
        {navItemsSmallScreen.map((item, index) => (
            <NavbarItem key={index} isActive={item.active}>
                <Tooltip content={item.toolTip} placement="bottom">
                    <Button
                        color="primary"
                        radius="md"
                        size="md"
                        className="border-none"
                        variant="ghost"
                        isIconOnly
                        style={{ padding: 10 }}
                    >
                        {item.icon}
                    </Button>
                </Tooltip>
            </NavbarItem>
        ))}
    </NavbarContent>
</>);

const MainNavBar = (<>
    <Navbar isBordered className="hidden sm:flex w-full px-0 mx-0" isBlurred={false}>
        <NavbarBrand className="flex flex-start hidden sm:flex">
            {LogoComponent}
        </NavbarBrand>
        {MainNavigation}
        <NavbarContent className="hidden sm:flex" justify="end">
            {rightItems.map((item, index) => (
                <NavbarItem key={index}>
                    <Tooltip content={item.toolTip} placement="bottom">
                        <Button
                            color="primary"
                            radius="md"
                            size="sm"
                            className="border-none"
                            variant="ghost"
                            isIconOnly
                            style={{ padding: 7 }}>
                            {item.icon}
                        </Button>
                    </Tooltip>
                </NavbarItem>
            ))}
        </NavbarContent>
    </Navbar>
    <Navbar isBordered style={{ width: "100%", padding: -20 }} className="w-full flex sm:hidden w-full px-0 mx-0" isBlurred={false}>
        {MainNavigation}
    </Navbar>
</>)


export default function NavigationBar() {
    return (<>
        {MainNavBar}
    </>);
}
