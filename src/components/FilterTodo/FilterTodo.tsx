import { Button } from "antd"
import { FilterTodoChoice } from "../../types/todo"
import styles from "./FilterTodo.module.css"

interface TodoStats {
  all: number
  completed: number
  inWork: number
}
interface FilterTodoProps {
  setFilter: (filter: FilterTodoChoice) => void
  filter: FilterTodoChoice
  todoStats: TodoStats
}

const FilterTodo = ({ todoStats, filter, setFilter }: FilterTodoProps) => {
  const { all, completed, inWork } = todoStats

  return (
    <div className={styles.filterButton}>
      <Button
        type="primary"
        htmlType="submit"
        onClick={() => setFilter("all")}
        className={filter === "all" ? styles.active : "buttonFilter"}
      >
        Все ({all})
      </Button>

      <Button
        type="primary"
        htmlType="submit"
        onClick={() => setFilter("inWork")}
        className={filter === "inWork" ? styles.active : "buttonFilter"}
      >
        В работе ({inWork})
      </Button>

      <Button
        type="primary"
        htmlType="submit"
        onClick={() => setFilter("completed")}
        className={filter === "completed" ? styles.active : "buttonFilter"}
      >
        Готово ({completed})
      </Button>
    </div>
  )
}

export default FilterTodo
