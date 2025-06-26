import footerStyles from '@/shared/styles/footer.module.css';
import Image from 'next/image';
import Link from 'next/link';


export default function Footer(){
    return (<footer className={footerStyles.wrapper}>
        <div className={footerStyles.footerLogoAndTextWrapper}>
            <Image
                className={footerStyles.FooterAppLogo}
                src={"/images/logo.png"}
                alt="Braincize"
                sizes=""
                fill={true}
            />
            <div className={footerStyles.footerSupportEmail}>
                <span className='font-bold'>support and help team</span>
                <span>info@braincize.com</span>
            </div>
        </div>
        <div className={footerStyles.quickLinksParentWrapper}>
            <div className={footerStyles.quickLinksWrapper}>
                <h6 className='font-bold'>QuickLinks</h6>
                <div className={footerStyles.quickLinksdiv}>
                    <Link href={`/`}>Home</Link>
                    <Link href={`/about`}>About</Link>
                    <Link href={`/research`}>Research</Link>
                </div>
            </div>
            <div className={footerStyles.quickLinksWrapper}>
                <h6 className='font-bold'>Legals</h6>
                <div className={footerStyles.quickLinksdiv}>
                    <Link href={`/terms`}>Terms of Service</Link>
                    <Link href={`/#`}>Privacy Policy</Link>
                    <Link href={`/research`}>Research</Link>
                </div>
            </div>
            <div className={footerStyles.quickLinksWrapper}>
                <h6 className='font-bold'>Contact Us</h6>
                <div className={footerStyles.quickLinksdiv}>
                    <span>Phone</span>
                    <span>+1 (305) 604-453</span>
                    <span className="flex gap-2">
                        <Link href={""}>
                            <Image
                                className={footerStyles.Icons}
                                src={"/images/twitter.svg"}
                                alt="Twitter"
                                width={30}
                                height={30}
                                
                            />                        
                        </Link>

                        <Link href={""}>
                            <Image
                                className={footerStyles.Icons}
                                src={"/images/fb.svg"}
                                alt="Facebook"
                                width={30}
                                height={30}
                            />                        
                        </Link>

                    </span>
                </div>
            </div>
        </div>
    </footer>)
}