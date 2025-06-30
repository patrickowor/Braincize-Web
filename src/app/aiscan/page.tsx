import aiStyle from "./aiscan.module.css"

export default function Aiscan(){
    return(<div className={aiStyle.aiscan}>
        <div className={aiStyle.aiscanTop}>
            <h2 className={aiStyle.aiscanTopH2}>Try Braincize</h2>
            <p className={aiStyle.aiscanTopP}>Unlock your brain story with with AI application of MRI study</p>
            <button className={aiStyle.aiscanTopButton}>Learn More</button>
        </div>
        <div className={aiStyle.upload_container}>
            <div className={aiStyle.upload_area} id="uploadArea">
                <div className={aiStyle.upload_icon}><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    <path d="M12,11L16,15H13V19H11V15H8L12,11Z" />
                </svg></div>
                <div className={aiStyle.upload_text}>Click to upload or Drag and drop</div>
                <div className={aiStyle.upload_subtext}>Support for multiple file types (PDF, DOC, TXT, etc.)</div>
                <input type="file" id="fileInput" className={aiStyle.file_input} multiple accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"/>
            </div>
            <button className={aiStyle.fileButton}>AI Scan</button>
        </div>
    </div>)
}