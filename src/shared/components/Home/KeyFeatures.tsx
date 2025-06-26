import Image  from "next/image";
import homeStyle from "@/app/index.module.css";

export default function KeyFeatures() {
  return (<section className={homeStyle.keyFeatures}>
    <h3 className={`fnt-poppins ${homeStyle.keyFeaturesHeader}`}>key Features</h3>
    <div className={homeStyle.keyFeaturesDiv}>

      <div className={homeStyle.keyFeaturesCard} >
        <div className={homeStyle.keyFeaturesLogo} >
          <Image 
            src={'/images/cloudUploadHome.png'}
            alt="Cloud Upload"
            width={120}
            height={120}
          />
        </div>
        <div>
          <h4 className={`fnt-poppins  ${homeStyle.keyFeaturesH3}`}  >Upload Scan</h4>
          <p className={`fnt-poppins  ${homeStyle.keyFeaturesP}`}>Upload your MRI scan securely. Our platform uses encrypted, HIPAA-compliant methods.</p>
        </div>
      </div>
      <div className={homeStyle.keyFeaturesCard}>
        <div className={homeStyle.keyFeaturesLogo}>
          <Image 
            src={'/images/brainFeatHome.png'}
            alt="Cloud Upload"
            width={120}
            height={120}
          />
        </div>
        <div>
          <h4 className={`fnt-poppins  ${homeStyle.keyFeaturesH3}`}  >AI Analysis</h4>
          <p className={`fnt-poppins  ${homeStyle.keyFeaturesP}`} >Our AI analyzes the scan for signs of brain volume loss and neurodegeneration.</p>
        </div>
      </div>
      <div className={homeStyle.keyFeaturesCard}>
        <div className={homeStyle.keyFeaturesLogo} >
          <Image 
            src={'/images/fileFeatHome.png'}
            alt="Cloud Upload"
            width={120}
            height={120}
          />
        </div>
        <div>
          <h4 className={`fnt-poppins  ${homeStyle.keyFeaturesH3}`} >Report & Insights</h4>
          <p className={`fnt-poppins  ${homeStyle.keyFeaturesP}`} >You receive a detailed report with easy-to-understand insights and next steps</p>
        </div>
      </div>
    </div>
  </section>)
} 