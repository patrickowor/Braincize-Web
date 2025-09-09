import ContactForm from "@/shared/components/ContactForm";
import contactStyle from "./contact.module.css"
import faqStyle from "@/app/faq.module.css";

export default function Contact() {
    return (<>
        <div className={contactStyle.contactpage}>
            <h2 className={`fnt-monserat ${contactStyle.contactpage_h2}`}>Contact us</h2>
            <div className={`fnt-poppings ${contactStyle.contactpage_p}`}>
                <p>Social links and articles</p>
                <p>Twitter Research gate Legal Expert</p>
            </div>
        </div>
        <section className={contactStyle.FormSection}>
            <div className={contactStyle.FormDiv}>
                <ContactForm style={faqStyle} />
            </div>
        </section>
    </>);
}