import { FilterTodoProps } from "../assets/models/todo"
import styles from "./FilterTodo.module.css"

const FilterTodo = ({
  setFilter,
  filter,
  allCount,
  workCount,
  doneCount,
}: FilterTodoProps) => {
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
