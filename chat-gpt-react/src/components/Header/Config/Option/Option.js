import './Option.css';

function Option({option}){
  return (
    <div class={`Option ${option.selected ? 'selected' : ''}`}>
      {option.name}
    </div>
  )
}

export default Option

