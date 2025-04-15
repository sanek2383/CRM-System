// import { filterFetchTodos } from "../api/apiTodo.ts"
import { TodoItem } from "../types/todo.ts"
import styles from "./FilterTodo.module.css"

interface FilterTodoProps {
  setFilter: (filter: "all" | "work" | "done") => void
  filter: "all" | "work" | "done"
  todo: TodoItem[]
}

const FilterTodo = ({ todo, filter, setFilter }: FilterTodoProps) => {
  

  const allCount=todo.length

  const workCount = todo.filter((item) => !item.isDone).length
  const doneCount = todo.filter((item) => item.isDone).length


  return (
    <div className={styles.filterButton}>
      <button
        onClick={() => setFilter("all")}
        className={filter === "all" ? styles.active : "buttonFilter"}
      >
        all ({allCount})
      </button>
      <button
        onClick={() => setFilter("work")}
        className={filter === "work" ? styles.active : "buttonFilter"}
      >
        work ({workCount})
      </button>
      <button
        onClick={() => setFilter("done")}
        className={filter === "done" ? styles.active : "buttonFilter"}
      >
        done ({doneCount})
      </button>
    </div>
  )
}

export default FilterTodo
