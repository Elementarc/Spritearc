import { Children, ReactNode, useRef } from "react"
import { validate_files } from "../spritearc_lib/validate_lib"
import Section from "./section"

export default function Dropzone({children, label, onDrop}: {children?: ReactNode, label: string, onDrop: (files: File[]) => void}) {
    const dropzoneRef = useRef<null | HTMLDivElement>(null)
    const onDropEvent = (e: any) => {
        if(!dropzoneRef.current) return
        e.preventDefault()
        
        const files: File[] = e.dataTransfer.files
        const validation = validate_files(files)
        if(typeof validation === "string") return 
        onDrop(files)

    }
    
    const onDragOverEvent = (e: any) => {
        if(!dropzoneRef.current) return
        e.preventDefault()
        
    }

    const onDragLeaveEvent = (e: any) => {
        if(!dropzoneRef.current) return
        e.preventDefault()
        
    }

    return (
        <>
            <Section label={label}>
                <div key={`dropzone_${label}`} ref={dropzoneRef} onDrop={onDropEvent} onDragOver={onDragOverEvent} onDragLeave={onDragLeaveEvent} className='dropzone_container'>
                    
                    {children && children}
                    
                </div>
            </Section>
            
        </>

        
    );
}