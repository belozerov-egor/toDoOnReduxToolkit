import {useEffect} from 'react';
import './App.css';
import {Todolist} from "./component/Todolist";
import {AddItemForm} from "./component/AddItemForm";
import {useAppDispatch, useAppSelector} from "./component/hooks/hooks";
import {TodolistThunks} from "./component/reducers/TodolistReduser";
import {TodolistSelector} from "./component/reducers/TodolistSelectors.ts";


function App() {
    const dispatch= useAppDispatch()
    const todos = useAppSelector(TodolistSelector)

    useEffect(()=> {
        dispatch(TodolistThunks.getTodosTC())
    },[])

    const addTodolitHandler = (title: string) => {
        dispatch(TodolistThunks.addTodo({title}))
    }


    console.log('App')

    return (
        <div className="App">
            <AddItemForm callBack={addTodolitHandler}/>
            {todos.map(tl => {

                return (
                    <Todolist
                        key={tl.id}
                        todolistId={tl.id}
                        title={tl.title}
                        filter={tl.filter}
                    />
                )
            })}


        </div>
    )
}

export default App;
