import Link from "next/link"
import { FrameEl } from "../frameElement"
import Style  from "@/app/about/about.module.css";

export function Founder(){
    return <div>
    <FrameEl src="/images/Founder.png" reverse={true} style={{ marginTop: '50px', paddingBlock: '0px'}} imgClass={Style.spotlightImg} textClass={Style.spotlightTextDiv} >
            <div >
                <h3 className={`${Style.spotlightTitle} `}>
                    <span>Meet the Visionary Behind</span>
                    <span>Braincize</span>
                </h3>
                <div className={`${Style.spotlightBody} `}>
                    Dr. Calvin H. Flowers <br />
                    is a renowned academic neuroradiologist and a pioneering force in Magnetic Resonance Imaging (MRI) and neurodiagnostics. With decades of experience,
                </div>
            </div>
        </FrameEl>
        <div className={`${Style.spotlightBody} ${Style.padd} fnt-poppins`} style={{paddingTop: '0px'}}>
            <div className={Style.spotlightBodyInner}>
            his groundbreaking research has advanced the early detection and understanding of neurodegenerative diseases such as Alzheimer’s, Parkinson’s, and traumatic brain injuries (TBI). His expertise bridges neuroscience, artificial intelligence, and cutting-edge imaging technology. <br />
            <Link className={`signup-btn ${Style.spotlightButton}`} href={"/about"}  style={{marginTop: '10px'}}> Read More </Link>
            </div>

        </div>
    </div>

}