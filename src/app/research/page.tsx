import termsStyle from "@/app/terms.module.css";

export default function research() {

    return <>
        <div className={termsStyle.researchHeader}>
            <div className={termsStyle.header_Frame}>
                <h1 className={`fnt-monserat ${termsStyle.ResearchTitle}`}>
                    Research
                </h1>
            </div>
        </div>

        <div className={termsStyle.researchMain}>
           <div className={termsStyle.un_Order}>
                <div className={termsStyle.list}>
                    <li className={`fnt-poppins ${termsStyle.researchLists}`}>
                        CORTICAL ATROPHY IN NFL PLAYERS WITH CONCUSSION ON CONVENTIONAL MRI BRAIN IMAGING
                    </li>

                    <a href="#" className={`fnt-poppins ${termsStyle.a_link}`}>Read more</a>
                </div>
                <div className={termsStyle.list}>
                    <li className={`fnt-poppins ${termsStyle.researchLists}`}>
                        IMAGING OF MILD TRAUMATIC BRAIN INJURY CONCUSSION
                    </li>

                    <a href="#" className={`fnt-poppins ${termsStyle.a_link}`}>Read more</a>
                </div>
                <div className={termsStyle.list}>
                    <li className={`fnt-poppins ${termsStyle.researchLists}`}>
                        UTILIZATION OF ROUTINE MRI
                    </li>

                    <a href="#" className={`fnt-poppins ${termsStyle.a_link}`}>Read more</a>
                </div>
                <div className={termsStyle.list}>
                    <li className={`fnt-poppins ${termsStyle.researchLists}`}>
                        ENCEPHALOPATHY IN AIDS PATIENTS: Evaluation with MR Imaging
                    </li>

                    <a href="#" className={`fnt-poppins ${termsStyle.a_link}`}>Read more</a>
                </div>
                <div className={termsStyle.list}>
                    <li className={`fnt-poppins ${termsStyle.researchLists}`}>
                        MR EVALUATION OF SKULL BASE LESIONS
                    </li>

                    <a href="#" className={`fnt-poppins ${termsStyle.a_link}`}>Read more</a>
                </div>    
           </div>        
        </div>
    </>
} 