import { Selected } from "./Mission"
import { FrameEl } from "../frameElement"
import Style from '@/app/about/about.module.css'

// #eaf8fa
export function ResearchFocus() {
    const mytitle = `Research Focus`
    return <section className={`bg-gradient-to-tr from-[#f7f5f5] to-white ${Style.PADDINGTOP}`}>
        <h3 className={`${Style.spotlightTitle} ${Style.spotlightTitle2Hide}`}>
            <span>{mytitle}</span>
        </h3>
        <FrameEl src={`/images/ResearchFocus.png`} wrapperClass={Style.MissionFrameWrapper} imgClass={Style.MissionFrameimage} textClass={Style.MissionTextWrapper} reverse={true}> 
            <div>
                <h3 className={`${Style.spotlightTitle} ${Style.spotlightTitleHide}`}>
                    <span>{mytitle}</span>
                </h3>

                <div className={`${Style.spotlightBody} ${Style.MissionBody} `}>
                    Under the leadership of Dr. Flowers, Braincize has:

                    <ul>
                        <li><Selected /> <span>Developed protocols to detect early brain atrophy globally.</span> </li>

                        <li><Selected /> <span>Presented MRI findings at leading medical and radiological conferences.</span> </li>

                        <li><Selected /> <span>Enable early diagosis of neurodegenerative diseases.</span>  </li>

                        <li><Selected /> <span>Pioneered the integration of AI and machine learning with neuroimaging.</span> </li>
                    </ul>
                </div>
                
            </div>
        </FrameEl>
    </section>
}
