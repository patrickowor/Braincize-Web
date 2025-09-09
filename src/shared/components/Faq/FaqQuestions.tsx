import faqStyle from "@/shared/styles/faq.module.css";

export function FaqQuestions() {
    return (
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
    )
}