import React from 'react';
import './Chat.css';
import Message from './Message/Message'

function Chat(){
  const chats = [
    {role: 'user', content: 'hello there'},
    {role: 'assistant', content: 'how can I help you?'},
    {role: 'user', content: 'what is 2+2?'},
    {role: 'assistant', content: 'the answer is 4'},
  ]
  return (<div className='Chat'>
    {chats.map(m => <Message role={m.role} content={m.content} />)}
  </div>)
}

export default Chat

