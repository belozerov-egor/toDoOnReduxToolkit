import {useCallback, useEffect} from 'react';
import './App.css';
import {Todolist} from "./component/Todolist";
import {AddItemForm} from "./component/AddItemForm";
import {useAppDispatch, useAppSelector} from "./component/hooks/hooks";
import {addTodosTC, getTodosTC} from "./component/reducers/TodolistReduser";
import {TodolistSelector} from "./component/reducers/TodolistSelectors.ts";


function App() {
    const dispatch= useAppDispatch()
    const todos = useAppSelector(TodolistSelector)

    useEffect(()=> {
        dispatch(getTodosTC())
    },[])

    const addTodolitHandler = useCallback((title: string) => {
        dispatch(addTodosTC(title))
    }, [dispatch])


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
