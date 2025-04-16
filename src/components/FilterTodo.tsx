import styles from "./FilterTodo.module.css"

interface TodoStats {
  all: number
  completed: number
  inWork: number
}
interface FilterTodoProps {
  setFilter: (filter: "all" | "work" | "done") => void
  filter: "all" | "work" | "done"
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
        all ({all})
      </button>
      <button
        onClick={() => setFilter("work")}
        className={filter === "work" ? styles.active : "buttonFilter"}
      >
        work ({inWork})
      </button>
      <button
        onClick={() => setFilter("done")}
        className={filter === "done" ? styles.active : "buttonFilter"}
      >
        done ({completed})
      </button>
    </div>
  )
}

export default FilterTodo
