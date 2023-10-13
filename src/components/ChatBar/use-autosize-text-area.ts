import { useEffect, useState } from "react";
import useDimensions from "./use-dimensions";

const useAutosizeTextArea = (
    textAreaRef: HTMLTextAreaElement | null,
    value: string,
    maxRows: number
) => {
    const [originalHeight, setOriginalHeight] = useState(0);
    const dimensions = useDimensions();

    useEffect(() => {
        if (textAreaRef === null) 
            setOriginalHeight(0);

        if (textAreaRef) {
            textAreaRef.style.height = '0px';
            const scrollHeight = textAreaRef.scrollHeight;
            
            if (originalHeight === 0) 
                setOriginalHeight(scrollHeight);

            // No more than max rows
            if (scrollHeight > originalHeight * maxRows) 
                textAreaRef.style.height = (originalHeight * maxRows) + 'px';
            else
                textAreaRef.style.height = scrollHeight + 'px';
        }
    }, [dimensions, originalHeight, textAreaRef, value, maxRows]);
}

export default useAutosizeTextArea;