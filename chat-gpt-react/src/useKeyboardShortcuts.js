import {useState, useEffect} from 'react';

export function useKeyboardShortcuts() {

    const [update, setUpdate] = useState();

    function handleKeydown(e){
        if (e.key === 'c' && e.ctrlKey){
            setUpdate((u) => 'clear' )
            setTimeout(() => setUpdate(null),1000)
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeydown);
        
        return () => {
            window.removeEventListener('keydown', handleKeydown)
        }
        
    },[])

    return update
}

