import {useState} from 'react';
import Chat from './components/Chat/Chat';
import Inputs from './components/Inputs/Inputs';
import Header from './components/Header/Header';


export default function App() {
    const [chats, setChats] = useState([
        {role: 'user', content: 'hello there'},
        {role: 'assistant', content: 'how can I help you?'},
        {role: 'user', content: 'what is 2+2?'},
        {role: 'assistant', content: 'the answer is 4'},
      ]);

    return (
    <>
       <Header />
       <Chat chats={chats}/>
       <Inputs setChats={setChats} />
    </>
    )
}