import React, { FC, LegacyRef, useState, useRef } from 'react';
import { Link, forwardRef } from '@chakra-ui/react';
import NextLink from 'next/link'


import {
    Avatar,
    Box,
    Collapse,
    Drawer,
    DrawerContent,
    DrawerOverlay,
    Flex,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Text,
    useColorModeValue,
    useDisclosure,
  } from "@chakra-ui/react";
  import { FaBell, FaClipboardCheck, FaRss } from "react-icons/fa";
  import { AiFillGift } from "react-icons/ai";
  import { BsGearFill } from "react-icons/bs";
  import { HiCode, HiCollection } from "react-icons/hi";
  import { MdHome, MdKeyboardArrowRight } from "react-icons/md";

const Navigation = ({children}) => {


  
  const sidebar = useDisclosure();
  const integrations = useDisclosure();
  const color = useColorModeValue("gray.600", "gray.300");

  const NavItem : FC<{icon: any, children:any}> = forwardRef((props, ref) => {
    
    
    const { icon, children } = props;
    return (
      <Flex ref={ref} {...props}
        align="center"
        px="4"
        pl="4"
        py="3"
        cursor="pointer"
        color="inherit"
        _dark={{ color: "gray.400" }}
        _hover={{
          bg: "gray.100",
          _dark: { bg: "gray.900" },
          color: "gray.900",
        }}
        role="group"
        fontWeight="semibold"
        transition=".15s ease"
       
      >
        {icon && (
          <Icon
            mx="2"
            boxSize="4"
            _groupHover={{
              color: color,
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    );
  });

  const SidebarContent = (props) => (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg="white"
      _dark={{ bg: "gray.800" }}
      border
      color="inherit"
      borderRightWidth="1px"
      w="60"
      {...props}
    >
      <Flex px="4" py="5" align="center">
        <Text
          fontSize="2xl"
          ml="2"
          color="brand.500"
          _dark={{ color: "white" }}
          fontWeight="semibold"
        >
          DAO
        </Text>
      </Flex>
      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
      >
        <NextLink href='/' passHref>
            <NavItem icon={MdHome}>Home</NavItem> 
        </NextLink>

        <NextLink href='/staking' passHref>
           <NavItem icon={FaRss}>Locking</NavItem>
        </NextLink>

        <NextLink href='/rewards' passHref>
            <NavItem icon={HiCollection}>Rewards</NavItem>

        </NextLink>
        
      </Flex>
    </Box>
  );
  return (
    <Box as="section" bg="gray.50" _dark={{ bg: "gray.700" }} minH="100vh">
      <SidebarContent display={{ base: "none", md: "unset" }} />
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} transition=".3s ease">

          {children}       

      </Box>
    </Box>
  );
}
//My balance: 504304.394968082 TestToken (Tst)
export default Navigation;
