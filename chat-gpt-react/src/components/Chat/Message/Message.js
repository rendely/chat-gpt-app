import './Message.css';

function Message({role, content}){

  function formatMarkdown(input){
    const parts = input.replaceAll(/```([a-z]+)/g,'```<code:$1>').split('```');
    return (
      <>
    {parts.map(p => {
      if (p.match('<code')) return (
      <div key={p} className='code'>
        {p.replace('<code>', '')}
        </div>)
      else return <div key={p}>{p}</div>
    }
    )}
    </>
  )
  }

  return (
    <div className='Message'>
      <div className='role'>{role}</div>
      <div className='content'>
      { content.match('oaidalleapi') ?
      <img src={content} alt='Generated art' />
      : formatMarkdown(content)
      }
        </div>
    </div>
  )
}

export default Message

