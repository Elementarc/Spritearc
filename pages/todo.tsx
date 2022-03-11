import React, {Component} from "react"



type Todo_type = {
    id: number,
    name: string,
    done: boolean,
}
type State = {
    todos: Todo_type[],
}
const themeContext = React.createContext<any>(null)
export default class Todo extends Component<any, State> {
    static new_id: number = 0

    constructor(props: {names: string}) {
        super(props);
        this.state = {
            todos: []
        }
    }
    

    static generate_id() {
        return Todo.new_id = Todo.new_id + 1
    }
    
    
    add_todo(name: string) {
        this.setState({todos: [...this.state.todos, {id: Todo.generate_id(), name, done: false}]})
        sessionStorage.setItem("todos", JSON.stringify([...this.state.todos, {id: Todo.generate_id(), name, done: false}]))
    }

    componentDidMount() {
        if(sessionStorage.getItem("todos")) this.setState({todos: JSON.parse(sessionStorage.getItem("todos") as string)})
    }

    delete_todo(id: number) {
        const new_todos = [...this.state.todos]

        const todos = new_todos.filter(todo => todo.id !== id)

        this.setState({todos: todos})
    }
    
    toggle_todo(id: number) {
        const todo_index = this.state.todos.findIndex(todo => todo.id === id)
        const new_todos = [...this.state.todos]

        const todos = new_todos.map((todo) => {
            if(todo.id === id) todo.done = !todo.done
            return todo
        })
        this.setState({todos: todos})
    }

    todos_to_jsx() {
        
        const todo_jsx = this.state.todos.map((todo) => {

            return (
                <div className="todo" onClick={() => {this.delete_todo(todo.id)}} key={todo.id}>
                    <h1>{todo.id}</h1>
                    <h1>{todo.name}</h1>
                    <h1>{todo.done ? "DONE" : "OPEN"}</h1>
                    <h1 onClick={() => {}}>{todo.done}</h1>
                </div>
            )

        })

        return todo_jsx
    }

    render() {
        return (
            <themeContext.Provider value={{test: "Lol", name:" LOL"}}>
                
                <div className="TESTO">
                    {this.todos_to_jsx()}
                    <button onClick={() => {this.add_todo("Todo 4")}}>ADD TODO</button>
                </div>
                <Item/>
            </themeContext.Provider>
        )
    }
}


class Item extends Component {
    static contextType: any = themeContext
    
    
    render() {
        return (
            <div>
                <button>{`${this.context}`}</button>
            </div>
        );
    }
}
