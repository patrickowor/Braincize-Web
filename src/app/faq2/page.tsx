import faqStyle from "@/shared/styles/faq.module.css";
import ContactForm from "@/shared/components/ContactForm";
import Image  from "next/image"


export default function faq() {
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

        <div className={faqStyle.ImageContainer1}>
           <picture>
          <source 
            className={faqStyle.Image1}
            media="(max-width: 599.9px)"  
          />
          <Image
            className={faqStyle.Img1}
            src={"/images/BrainHomeSm.png"}
            alt="Braincize"
            width={1146.32}
            height={739.76}
          />  
        </picture>
        </div>

        <div className={faqStyle.faqBox}>
            <h2 className={`.fnt-poppins ${faqStyle.faqH2}`}>Frequently Asked Question (FAQ)</h2>
            <div className={`.fnt-poppins ${faqStyle.orderList}`}>
                <ol>
                    <li>
                        1. How is Braincize different from a regular MRI ?
                    </li>
                    <li>
                        2. Who should consider using Braincize ?
                    </li>
                    <li>
                        3. Is Braincize safe for everyone to use?
                    </li>
                    <li>
                        4. How long does it take to see results with Braincize ?
                    </li>
                </ol>
            </div>
        </div>

        <ContactForm style={faqStyle} />
    </>
}