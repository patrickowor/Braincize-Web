import homeStyle from "@/app/index.module.css";

export default function WhatIsBraincize(){
  return (<section className={`fnt-poppins ${homeStyle.WhatisSection}`}> 
    <h3 className={homeStyle.WhatisHeader}>What is Braincize?</h3>
      <p className={homeStyle.WhatisParagraph}>
        Braincize is an AI-powered neuroimaging tool that Analyzes MRI scans to detect early signs of brain 
        volume loss from injuries or neurodegenerative diseases, helping improve diagnosis and treatment
        planning.
      </p>
  </section>)
}