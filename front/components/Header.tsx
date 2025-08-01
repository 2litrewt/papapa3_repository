import React from 'react';
import styles from './Header.module.scss';
import { MenuBar } from "@/components/MenuBar";

export default function Header() {
  return (
    <header>
     <MenuBar />
    </header>
  );
}
