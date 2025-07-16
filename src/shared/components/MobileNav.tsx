"use client";

import HeaderStyles from '@/shared/styles/header.module.css';
import { SidebarClose, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from "next/image"
import Link from 'next/link';
import { usePathname } from "next/navigation";

export const HeaderLogo = () => <Image
  className={HeaderStyles.HeaderAppLogo}
  src={"/images/logo.png"}
  alt="Braincize"
  sizes=""
  fill={true}
/>;


export const NavLinks = () => {
  return (<>
    <Link href="/" >Home</Link>
    <Link href={"/about"} >About us</Link>
    <Link href={"/contact"} >Contact</Link>
    <Link href={"/research"}>Research</Link>
  </>)
}

export default function MobileNavbar() {
  const [toggled, settoggled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    settoggled(false)
  }, [pathname]);




  return (
    <>
      {!toggled && <span className={`${styles.mobileNavSpan}`} onClick={() => settoggled(true)}><Menu className={styles.mobileNav} size={24} /> <span>Menu</span></span>}
      {toggled && <nav className={`${styles.navbar}`}>
        <div className={styles.navbarContent}>
          <span className={styles.logo}>
            <HeaderLogo />
          </span>
          <button className={styles.menuButton} aria-label="Open menu">
            <SidebarClose size={24} onClick={() => settoggled(false)} />
          </button>
        </div>
        <div className={styles.navbarItems}>
          <NavLinks />
        </div>
      </nav>}
    </>

  );
}


const styles = {
  navbar: `fixed top-0 left-0 w-full z-50  backdrop-blur-md shadow-md`,
  navbarContent: `flex justify-between items-center px-4 py-3`,
  logo: `text-white font-bold text-lg`,
  menuButton: `text-white focus:outline-none`,
  mobileNav: HeaderStyles.mobileNav,
  mobileNavSpan: HeaderStyles.mobileNavSpan,
  navbarItems: HeaderStyles.mobileNavItems
}