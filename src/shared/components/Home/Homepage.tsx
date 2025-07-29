import { getImageProps } from 'next/image' 
import Image  from "next/image";
import homeStyle from "@/app/index.module.css";
import Link from "next/link";

export default function HomePage() {

  const {props: {style, srcSet, ..._}, } = getImageProps({
    src: "/images/BrainHomeSm.png",
    alt: "Braincize",
    width:362.66,
    height:187.14
  })

  return (<section className={homeStyle.homepage}>
    <div className={homeStyle.homepageStack}>
      <div className={`fnt-monserat ${homeStyle.homePageParent}`}>
          <div className={homeStyle.homepageTextWrapper}>
            <span>AI-Powered Brain</span>
            <span>Atrophy</span>
            <span>Detection</span>
          </div>
          <p className={`poppins ${homeStyle.homepageSubText}`}>
            <span>Achieve over 90% accuracy in detecting brain </span>
            <span>volume loss with our advanced AI solutions.</span>
          </p>
      </div>

      <div className={homeStyle.HomePageImageDiv}>
        <picture>
          <source 
            className={homeStyle.HomePageImage}
            media="(max-width: 599.9px)" 
            style={style} 
            srcSet={srcSet} 
          />
          <Image
            className={homeStyle.HomePageImage}
            src={"/images/BrainHome.png"}
            alt="Braincize"
            width={1197.64}
            height={618}
          />  
        </picture>
      </div>   
    </div>
    <div className={homeStyle.exploreBtnDiv}>
      <Link className={`poppins signup-btn  ${homeStyle.exploreBtn}`} href={"/signup"}>Explore our Technology</Link>
    </div>
      
  </section>);
}
