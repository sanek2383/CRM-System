import styles from "./FilterTodo.module.css"

interface TodoStats {
  all: number
  completed: number
  inWork: number
}
interface FilterTodoProps {
  setFilter: (filter: "all" | "inWork" | "completed") => void
  filter: "all" | "inWork" | "completed"
  todoStats: TodoStats
}

const FilterTodo = ({ todoStats, filter, setFilter }: FilterTodoProps) => {
  const { all, completed, inWork } = todoStats

  return (
    <div className={styles.filterButton}>
      <button
        onClick={() => setFilter("all")}
        className={filter === "all" ? styles.active : "buttonFilter"}
      >
        Все ({all})
      </button>
      <button
        onClick={() => setFilter("inWork")}
        className={filter === "inWork" ? styles.active : "buttonFilter"}
      >
        В работе ({inWork})
      </button>
      <button
        onClick={() => setFilter("completed")}
        className={filter === "completed" ? styles.active : "buttonFilter"}
      >
        Готово ({completed})
      </button>
    </div>
  )
}

export default FilterTodo
