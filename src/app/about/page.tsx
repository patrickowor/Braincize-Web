import { Founder } from "@/shared/components/about/Founder";
import { Mission } from "@/shared/components/about/Mission";
import {  ResearchFocus } from "@/shared/components/about/ResearchFocus";
import { MessageFromFounder } from "@/shared/components/about/Message";
import Style from "./about.module.css";

export default function About (){
    return (<>
    <div className={Style.Wrapper}>
        <Founder  />
        <Mission />
        <ResearchFocus />
        <MessageFromFounder />
    </div>
    </>);
}