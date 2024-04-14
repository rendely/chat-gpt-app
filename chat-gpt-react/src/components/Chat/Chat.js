import React from 'react';
import './Chat.css';
import Message from './Message/Message'

function Chat({chats}){
  
  return (<div className='Chat'>
    {chats.map((m,i) => <Message key={i} role={m.role} content={m.content} />)}
  </div>)
}

export default Chat

