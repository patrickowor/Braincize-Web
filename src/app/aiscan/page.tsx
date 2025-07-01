import aiStyle from "./aiscan.module.css"
import Image from "next/image"

export default function Aiscan(){
    return(<div className={aiStyle.aiscan}>
        <div className={aiStyle.aiscanTop}>
            <h2 className={aiStyle.aiscanTopH2}>Try Braincize</h2>
            <p className={aiStyle.aiscanTopP}>Unlock your brain story with with AI application of MRI study</p>
            <button className={aiStyle.aiscanTopButton}>Learn More</button>
        </div>
        <div className={aiStyle.upload_container}>
            <div className={aiStyle.upload_area}>
                <label id="uploadArea" htmlFor="fileInput">
                <Image className={aiStyle.upload_icon}
                    src={"/images/Vector.png"}
                    alt="Braincize"
                    width={100}
                    height={109}
                />
                <div className={aiStyle.upload_text}>Click to upload or Drag and drop</div>
                <div className={aiStyle.upload_subtext}>Support for multiple file types (PDF, DOC, TXT, etc.)</div>
                </label>
                <input type="file" id="fileInput" className={aiStyle.file_input} multiple accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"/>
            </div>
            <button className={aiStyle.fileButton}>AI Scan</button>
        </div>
    </div>)
}