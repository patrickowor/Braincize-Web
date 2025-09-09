import { FrameEl } from "../frameElement";
import Style from "@/app/index.module.css";
import Link from "next/link";

export function Spotlight() {
    return <div  className="bg-gradient-to-tr from-[#eaf8fa] to-white">
        <WhereAiMeetsMl />
        <Founder />
    </div>
}

export function WhereAiMeetsMl(){
    return <FrameEl src="/images/WhereAiMeetsMl.png" style={{ paddingTop: '50px'}}>
            <div>
                <h3 className={`${Style.spotlightTitle} `}>
                    <span>Where Neuroscience Meets</span>
                    <span>Machine Learning</span>
                </h3>

                <div className={`${Style.spotlightBody} `}>
                    We&apos;re rethinking brain health with AI that sees what others miss. At Braincize, our smart imaging technology helps detect early signs of brain injury and disease in veterans, athletes, and at-risk individuals long before symptoms appear.
                </div>

                <Link className={`signup-btn ${Style.spotlightButton}`} href={"/research"}> Learn More </Link>
            </div>
        </FrameEl>
}

export function Founder({ useAlternativeTitle=false}){
    return <FrameEl src="/images/Founder.png" reverse={true} style={{ marginTop: '50px'}}>
            <div >
                <h3 className={`${Style.spotlightTitle} `}>
                    {
                        useAlternativeTitle ? 
                        <>
                            <span>Meet the Visionary Behind</span>
                            <span>Braincize</span>
                        </> :
                        <span>Founder Spotlight</span>

                    }
                </h3>
                <div className={`${Style.spotlightBody} `}>
                    Meet Dr. Calvin H. Flowers <br />
                    Pioneer in MRI and AI-driven brain diagnostics, Dr. Flowers has shaped global neuroimaging standards. His mission? To detect brain trauma earlier — from war zones to playing fields — and turn insight into action.
                    “When we understand brain damage earlier, we can act earlier. That changes everything

                </div>
                <Link className={`signup-btn ${Style.spotlightButton}`} href={"/about"}> Read More </Link>
            </div>
        </FrameEl>
}