import contactStyle from "./contact.module.css"

export default function Contact() {
    return (<>
        <div className={contactStyle.contactpage}>
            <h2 className={`fnt-monserat ${contactStyle.contactpage_h2}`}>Contact us</h2>
            <div className={`fnt-poppings ${contactStyle.contactpage_p}`}>
                <p>Social links and articles</p>
                <p>Twitter Research gate Legal Expert</p>
            </div>
        </div>
        <div>
            <form action="" className={`fnt-poppings ${contactStyle.formm}`}>
                <input type="text" placeholder="Your Name" className={contactStyle.formm_maininput}/>
                <input type="email" placeholder="Your Email"className={contactStyle.formm_maininput}/>
                <input type="text" placeholder="Your Address"className={contactStyle.formm_maininput}/>
                <input type="number" placeholder="Your Number"className={contactStyle.formm_maininput}/>
                <textarea placeholder="Write Something" className={contactStyle.formm_textarea}></textarea>
                <button className={`fnt-poppings ${contactStyle.formm_button }`}>Contact Us</button>
            </form>
        </div>
    </>);
}