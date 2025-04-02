import { FilterTodoProps } from "../assets/models/todo"

const FilterTodo = ({setFilter, allCount, workCount, doneCount}:FilterTodoProps) => {
  return (
    <>
      <button onClick={()=> setFilter('all')}>all({allCount})</button>
      <button onClick={()=> setFilter('work')}>work({workCount})</button>
      <button onClick={()=> setFilter('done')}>done({doneCount})</button>
      
    </>
  )
}

export default FilterTodo
