type ContactFormProps = {
  style: Record<string, string>;
};  

export default function ContactForm( { style }: ContactFormProps) {
    return (
        <div>
            <form action="#" className={style.formContainer}>
                <div className={style.nameGroup}>
                    <div className={style.inputWrapper}>
                    <input type="text" id="name" name="name" placeholder="Your Name"/>
                    </div>
                    <div className={style.inputWrapper}>
                    <input type="email" id="email" name="email"  placeholder="Your Email"/>
                    </div>
                </div>
                 <div className={style.nameGroup}>
                    <div className={style.inputWrapper}>
                    <input type="text" id="address" name="address" placeholder="Your Address"/>
                    </div>
                    <div className={style.inputWrapper}>
                    <input type="text" id="number" name="number" placeholder="Your Number"/>
                    </div>
                </div>
                <div className={style.inputWrapper}>
                    <textarea id="text" name="text" placeholder="Write Something"></textarea>
                </div>
            </form>
            <button typeof="button" className={`fnt-poppins ${style.but}`}>Learn More</button>
        </div>
    )
}