import { Founder } from "@/shared/components/about/Founder";
import { Mission } from "@/shared/components/about/Mission";
import Style from "./about.module.css";

export default function About (){
    return (<>
    <div className={Style.Wrapper}>
        <Founder  />
        <Mission />
    </div>
    </>);
}