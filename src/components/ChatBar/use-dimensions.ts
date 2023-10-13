import { useCallback, useEffect, useState } from "react";

function useDimensions() {
    const [dimensions, setDimensions] = useState({width: window.innerWidth, height: window.innerHeight});

    const handleResize = useCallback(() => {
        setDimensions({width: window.innerWidth, height: window.innerHeight});
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize);
    })

    return dimensions;
}

export default useDimensions;