import './Option.css';

function Option({option, handleClick}){
  return (
    <div 
      className={`Option ${option.selected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      {option.name}
    </div>
  )
}

export default Option

