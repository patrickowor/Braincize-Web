import Style from '@/app/about/about.module.css'

export function MessageFromFounder() {
    return <section  className={`bg-gradient-to-r from-[#eaf8fa] to-white ${Style.PADDINGTOP}  fnt-poppins`} style={{paddingBottom: '10px'}}>
        <h3 className={`${Style.founderMessageTitle}`}>
            <span>A Message from Dr. Flowers</span>
        </h3>

        <div className={`${Style.founderMessage} text-center`}>
            <span>My mission has always been to merge human empathy with scientific</span>
            <span>innovation. Through Braincize, we’re not just scanning brains we’re</span>
            <span>empowering lives by providing early, life-saving insights</span>
              
        </div>

    </section>
}