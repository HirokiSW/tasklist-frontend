import { useState } from 'react'

function TaskForm({ onTaskAdded }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        const taskData = { title } // title is required, so we can initialize the task object with it
        if (description) taskData.description = description // add these properties only if they have values
        if (dueDate) taskData.dueDate = dueDate

        fetch("http://localhost:8080/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData)
        })
            .then(response => response.json())
            .then(newTask => {
                onTaskAdded(newTask)
                setTitle('') // reset states after successful submission
                setDescription('')
                setDueDate('')
            })
    }

    return (
        <form className="create-task-form" onSubmit={handleSubmit}>
            <input 
                type="text"
                placeholder="Enter title here"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
            />
            <input 
                type="text"
                placeholder="Enter description here"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <input 
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
            />
            <button type="submit">Add Task</button>
        </form>
    )
}

export default TaskForm