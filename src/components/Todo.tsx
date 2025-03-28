// import React from "react"
import { TodoProps } from "../assets/models/todo"



const Todo: React.FC<TodoProps> = ({todo}) => {

    return <h3>{todo.text}</h3>

}

export default Todo