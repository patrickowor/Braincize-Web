import termsStyle from "@/app/terms.module.css";

export default function service() {

    return <>
    <div className={termsStyle.termHeader}>
        <div className={termsStyle.headerFrame}>
        <h1 className= {`fnt-monserat ${termsStyle.termTitle}`}>Terms of Service</h1>
        </div>
    </div>

    <div className={termsStyle.termMain}>
        <div className={termsStyle.term_Section}>
            <h2 className={`.fnt-poppins ${termsStyle.termSubHeader}`}>Terms of Service & Legal Disclaimer</h2>
            <p className={`.fnt-poppins ${termsStyle.termText}`}>Welcome to Braincize.com — an AI-powered neuroimaging diagnostic platform designed to predict brain volume loss in conditions such as mild traumatic brain injury (mTBI), chronic traumatic encephalopathy (CTE), and other neurodegenerative diseases. <br /> <br />

            By accessing or using this site, you agree to be bound by the terms below</p>
        </div>

        <div className={termsStyle.term}>
        <div className={termsStyle.termSection}>    
            <h2 className={`.fnt-poppins ${termsStyle.termSubHeader}`}>Intellectual Property</h2>
            <p className={`.fnt-poppins ${termsStyle.termText}`}>All materials on this site — including images, text, logos, documents, downloadable files, and diagnostic tools — are the exclusive property of Dr. Calvin Hubert Flowers, MD. Unauthorized use or distribution is strictly prohibited.</p>
        </div>
        <div className={termsStyle.termSection}>    
            <h2 className={`.fnt-poppins ${termsStyle.termSubHeader}`}>Age Restriction</h2>
            <p className={`.fnt-poppins ${termsStyle.termText}`}>You must be at least 18 years old to use Braincize. By accessing our platform, you confirm that you meet this age requirement. We do not take responsibility for misrepresentation of age.</p>
        </div>
        <div className={termsStyle.termSection}>    
            <h2 className={`.fnt-poppins ${termsStyle.termSubHeader}`}>Limitation of Liability</h2>
            <p className={`.fnt-poppins ${termsStyle.termText}`}>Braincize and its associates (including Dr. Calvin Flowers) are not liable for any damages, losses, or legal claims arising from your use of the site or reliance on its results. The AI analysis is informational and should not replace professional medical consultation.</p>
        </div>
        <div className={termsStyle.termSection}>    
            <h2 className={`.fnt-poppins ${termsStyle.termSubHeader}`}>Indemnity</h2>
            <p className={`.fnt-poppins ${termsStyle.termText}`}>By using this platform, you agree to hold harmless and indemnify Braincize, Dr. Calvin Flowers, and affiliated parties from any legal claims resulting from your use or misuse of the site.</p>
        </div>
        <div className={termsStyle.termSection}>    
            <h2 className={`.fnt-poppins ${termsStyle.termSubHeader}`}>Governing Law</h2>
            <p className={`.fnt-poppins ${termsStyle.termText}`}>These terms are governed by the laws of the State of Illinois, US</p>
        </div>
        <div className={termsStyle.termSection}>    
            <h2 className={`.fnt-poppins ${termsStyle.termSubHeader}`}>Severability</h2>
            <p className={`.fnt-poppins ${termsStyle.termText}`}>If any part of these Terms is found invalid under applicable law, the rest will still apply.</p>
        </div>
        <div className={termsStyle.termSection}>    
            <h2 className={`.fnt-poppins ${termsStyle.termSubHeader}`}>Updates</h2>
            <p className={`.fnt-poppins ${termsStyle.termText}`}>These Terms may change periodically to stay compliant with the law or to reflect new features. Major updates will be posted here or shared via email.</p>
        </div>
        </div>
    </div>
    </>
}