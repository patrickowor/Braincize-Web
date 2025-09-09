import faqStyle from "@/shared/styles/faq.module.css";
import ContactForm from "@/shared/components/ContactForm";
import { FaqQuestions } from "@/shared/components/Faq/FaqQuestions";
import Image  from "next/image"



export default function Faq() {
    return <>
        <div className={faqStyle.faqContainer}>
            <div>
                <h1 className={`fnt-monserat ${faqStyle.faqH1}`}>
                    Try Braincize
                </h1>
                <p className={`.fnt-poppins ${faqStyle.faqP1}`}>
                    Unlock your brain story with AI application of MRI study.
                </p>
            </div>

            <button typeof="button" className={`.fnt-poppins ${faqStyle.bnt1}`}>Learn More</button>
        </div>

        <div className={faqStyle.ImageContainer}>
           <picture>
          <source 
            className={faqStyle.Image1}
            media="(max-width: 599.9px)"  
          />
          <Image
            className={faqStyle.Img1}
            src={"/images/552d6e51e64bc2b9d2e1f2132d6d1d8d68a4b48a (4).png"}
            alt="Braincize"
            width={1146.32}
            height={739.76}
          />  
        </picture>
        </div>

        <FaqQuestions />

        <ContactForm style={faqStyle} />
    </>
}