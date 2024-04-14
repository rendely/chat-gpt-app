import './Message.css';

function Message({role, content}){
  console.log(content);
  return (
    <div className='Message'>
      <div className='role'>{role}</div>
      <div className='content'>{content}</div>
    </div>
  )
}

export default Message

