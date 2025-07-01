import HeaderStyles from '@/shared/styles/header.module.css';
import MobileNavbar, {HeaderLogo, NavLinks} from '@/shared/components/MobileNav';

import Link from 'next/link';

export default async function Header() {

    return (
        <header className={`fnt-monserat  ${HeaderStyles.wrapper}`} >
            <section className={HeaderStyles.head}>
                <div className={HeaderStyles.HeaderParent}>
                   <HeaderLogo /> 
                </div>
                <nav className={HeaderStyles.pcNav}>
                    <div className={HeaderStyles.NavLinkBigScreens}>
                        <NavLinks />
                    </div>
                    <div className={HeaderStyles.headerAuthBtnsParent}>
                        <Link className={`signup-btn ${HeaderStyles.login}`} href={"/login"}>Login</Link>
                        <Link className={`signup-btn  ${HeaderStyles.signup}`} href={"/signup"}>Sign Up</Link>
                    </div>
                </nav>
            </section>
            <MobileNavbar />
        </header>
    )
}