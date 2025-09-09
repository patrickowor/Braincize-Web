import Image  from "next/image";
import { JSX } from "react/jsx-runtime";
import Style from "@/shared/styles/frame-el.module.css";
import { CSSProperties } from "react";


type FrameElProp = {
    src: string;
    reverse?: boolean;
    children: JSX.Element;
    style?: CSSProperties;
    wrapperClass?: string;
    imgClass?: string;
    textClass?: string
};

export function FrameEl({ src, children, reverse=false, style, wrapperClass, imgClass, textClass } : FrameElProp) {
    return <section className={`${Style.wrapper} ${ reverse ? Style.wrapperReverse : '' } fnt-poppins ${wrapperClass ?? ''}`} style={style ?? {}}>
        <Image
            className={`${Style.image} ${imgClass ?? ''}`}
            src={src}
            alt="Braincize"
            width={411}
            height={568}
        />  

        <div className={`${Style.text}  ${textClass ?? ''}`}>
            {children}
        </div>
    </section>
}