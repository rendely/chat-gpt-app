import './Message.css';

function Message({role, content}){
  return (
    <div className='Message'>
      <div className='role'>{role}</div>
      <div className='content'>
      { content.match('oaidalleapi') ?
      <img src={content} alt='Generated art' />
      : <span>{content} </span>
      }
        </div>
    </div>
  )
}

export default Message

