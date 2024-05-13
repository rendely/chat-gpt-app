import {useState, useEffect} from 'react';

export function useKeyboardShortcuts() {

    const [update, setUpdate] = useState();

    function handleKeydown(e){
        if (e.key === 'c' && e.ctrlKey){
            setUpdate((u) => 'clear' )
            setTimeout(() => setUpdate(null),300)
        }

        if (e.key === 'm' && e.ctrlKey){
            setUpdate((u) => 'model' )
            setTimeout(() => setUpdate(null),300)
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

