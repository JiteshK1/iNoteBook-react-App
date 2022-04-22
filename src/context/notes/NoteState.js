import { useState } from "react";
import noteContext from "./noteContext";


const NoteState = (props) => {
    const host = "http://localhost:5000"
    const notesInitial = []

    const [notes, setnotes] = useState(notesInitial)
    const getNotes = async () => {
        // API Call 
        const response = await fetch(`http://localhost:5000/api/notes/fetchNotes/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')

            }
        });
        const json = await response.json()
        console.log(json)
        setnotes(json)
    }
    const addNote = async (title, description, tag) => {
        // TODO: API Call
        // API Call 
        const response = await fetch(`${host}/api/notes/addNote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')

            },
            body: JSON.stringify({ title, description, tag })
        });
        const note = await response.json();
        setnotes(notes.concat(note))
    }
    const deleteNote = async (id) => {
        const response = await fetch(`${host}/api/notes/deleteNote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')

            },
        });
        const json = await response.json();
        console.log(json)
        const newNote = notes.filter((note) => {
            return note._id !== id
        })
        setnotes(newNote)

    }
    const editNote = async (id, title, description, tag) => {
        // API Call 
        const response = await fetch(`${host}/api/notes/updateNote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')

            },
            body: JSON.stringify({ title, description, tag })
        });
        const json = response.json();
        console.log(json)
        let newNotes = JSON.parse(JSON.stringify(notes))
        // Logic to edit in client
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }
        setnotes(newNotes);

    }

    return (
        <noteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>

            {props.children}

        </noteContext.Provider>

    )
}

export default NoteState