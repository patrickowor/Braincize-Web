import { FrameEl } from "../frameElement"
import Style from '@/app/about/about.module.css'

export function Mission() {
    return <section className="bg-gradient-to-tr from-[#eaf8fa] to-white" style={{paddingTop: '50px'}}>
        <FrameEl src={`/images/mission.png`}> 
            <div>
                <h3 className={`${Style.spotlightTitle} `}>
                    <span>Our Mission</span>
                </h3>

                <div className={`${Style.spotlightBody} `}>
                    To develop advanced diagnostic imaging solutions using Artificial Intelligence (AI) and Magnetic Resonance Imaging (MRI) to:

                    <ul>
                        <li><Selected /> <span>Predict and monitor brain volume loss and shrinkage.</span> </li>

                        <li><Selected /> <span>Identify early signs of atrophy from mild traumatic Brain injury (mTBI) and chronic traumatic encephalopathy (CTE).</span> </li>

                        <li><Selected /> <span>Enable early atrophic changes and diagnosis in neurodegenerative diseases including Alzheimer’s, Parkinson’s as well as Multiple Sclerosis (MS)</span>  </li>

                        <li><Selected /> <span>Improve patient outcomes through informed intervention.</span> </li>
                    </ul>
                </div>
                
            </div>
        </FrameEl>
    </section>
}

const Selected = ({className} : {className? : string }) => {
    return <div>
            <svg className={className ?? ''} width="15" height="15" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_2001_569)">
        <circle cx="16" cy="16" r="15.5" stroke="#040A40"/>
        <circle cx="16" cy="16" r="10" fill="#040A40"/>
        </g>
        <defs>
        <clipPath id="clip0_2001_569">
        <rect width="32" height="32" fill="white"/>
        </clipPath>
        </defs>
        </svg>        
    </div>

}