import {useState, useEffect} from 'react';
import Chat from './components/Chat/Chat';
import Inputs from './components/Inputs/Inputs';
import Header from './components/Header/Header';


export default function App() {

    const [configs, setConfigs] = useState({model: '3.5', messages: []});

    // function to updateConfigs
    function updateConfigs(data){
      setConfigs(curr => ({...curr, ...data}));
    }

    // load configs from local storage
    useEffect(() => {
      // localStorage.removeItem('configs');
      const localConfigs = localStorage.getItem('configs');
      if (localConfigs != null) setConfigs(JSON.parse(localConfigs));
      const envAuthToken = process.env.REACT_APP_SECRET_KEY;
      if (envAuthToken) updateConfigs({key: envAuthToken});
      if (!!configs.messages) setConfigs(curr => ({...curr, messages: 
          [
            {role: 'user', content: 'hello there'},
            {role: 'assistant', content: 'how can I help you?'},
            {role: 'user', content: 'what is 2+2?'},
            {role: 'assistant', content: 'the answer is 4'},
          ]
        }));
    },[])

    // update local storage of configs if they ever change
    useEffect(() => {
      localStorage.setItem('configs',JSON.stringify(configs));
    },[configs])


    return (
    <>
       <Header configs={configs} updateConfigs={updateConfigs}/>
       <Chat messages={configs.messages}/>
       <Inputs configs={configs} updateConfigs={updateConfigs} />
    </>
    )
}