import { useState } from 'react'

function TaskItem({ task, onTaskDeleted, onTaskUpdated }) {
    const [editing, setEditing] = useState(false)
    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description || '') // default to empty string if property is null
    const [dueDate, setDueDate] = useState(task.dueDate || '')

    const handleDelete = () => {
        fetch(`http://localhost:8080/api/tasks/${task.id}`, {
            method: "DELETE"
        })
            .then(() => onTaskDeleted(task.id))
    }

    const handleComplete = () => {
        fetch(`http://localhost:8080/api/tasks/${task.id}/complete`, {
            method: "PUT"
        })
            .then(response => response.json())
            .then(updatedTask => onTaskUpdated(updatedTask))
    }

    const handleUndoComplete = () => {
        fetch(`http://localhost:8080/api/tasks/${task.id}/undo`, {
            method: "PUT"
        })
            .then(response => response.json())
            .then(updatedTask => onTaskUpdated(updatedTask))
    }

    const handleUpdate = (e) => {
        e.preventDefault()

        const taskData = {}
        if (title) taskData.title = title // edit these properties only if they have values
        if (description) taskData.description = description
        if (dueDate) taskData.dueDate = dueDate

        fetch(`http://localhost:8080/api/tasks/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData)
        })
            .then(response => response.json())
            .then(updatedTask => {
                onTaskUpdated(updatedTask)
                setEditing(false)
            })
    }

    if (editing) {
        return (
            <li className="edit-task-item">
                <form className="edit-task-form" onSubmit={handleUpdate}>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    <input
                        type="date"
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                    />
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditing(false)}>Cancel</button>
                </form>
            </li>
        )
    }

    return (
        <li className="task-item">
            <b>{task.title}</b> — {task.description || "No description provided"}

            {task.dueDate ? 
                <span> | Due: {task.dueDate}</span> : 
                <span> | No deadline added</span>
            }

            <button onClick={() => setEditing(true)}>Edit</button>

            {task.complete ?
                <button onClick={handleUndoComplete}>Undo Complete</button> : 
                <button onClick={handleComplete}>Complete</button>
            }

            <button onClick={handleDelete}>Delete</button>
        </li>
    )
}

export default TaskItem