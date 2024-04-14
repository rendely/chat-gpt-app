import React from 'react';
import './Chat.css';
import Message from './Message/Message'

function Chat({messages}){
  
  return (<div className='Chat'>
    {messages.map((m,i) => (
      m.role !== 'system' ? <Message key={i} role={m.role} content={m.content} /> : null ))}
  </div>)
}

export default Chat

