import { useState, useEffect } from 'react'
import './App.css'
import TaskItem from './TaskItem'
import TaskForm from './TaskForm'

function App() {
    const [tasks, setTasks] = useState([]) // array of task objects

    const fetchTasks = (url = "http://localhost:8080/api/tasks") => { // default to fetching all tasks if no URL is provided
        fetch(url)
            .then(response => response.json())
            .then(taskList => setTasks(taskList))
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    const handleTaskAdded = (newTask) => {
        setTasks([...tasks, newTask])
    }

    const handleTaskDeleted = (id) => {
        setTasks(tasks.filter(task => task.id !== id))
    }

    const handleTaskUpdated = (updatedTask) => {
        setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task))
    }

    return (
        <div className="app-container">
            <h1 className="app-title">My Tasks</h1>
            <TaskForm onTaskAdded={handleTaskAdded} />

            <div className="app-filters">
                <button onClick={() => fetchTasks()}>All Tasks</button>
                <button onClick={() => fetchTasks("http://localhost:8080/api/tasks/filter/complete?complete=true")}>Completed</button>
                <button onClick={() => fetchTasks("http://localhost:8080/api/tasks/filter/complete?complete=false")}>Incomplete</button>
                <button onClick={() => fetchTasks("http://localhost:8080/api/tasks/sort/due")}>Sort by Due Date</button>
                <button onClick={() => fetchTasks("http://localhost:8080/api/tasks/sort/created")}>Sort by Created</button>
            </div>

            <ul className="task-list">
                {tasks.map(task => (
                    <TaskItem key={task.id} 
                        task={task} 
                        onTaskDeleted={handleTaskDeleted} 
                        onTaskUpdated={handleTaskUpdated}
                    />
                ))}
            </ul>
        </div>
    )
}

export default App
