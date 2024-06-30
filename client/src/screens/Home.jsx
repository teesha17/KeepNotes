import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [add, setAdd] = useState(false);
    const [update,setupdate] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', body: '', deadline: '' });

    const handleAdd = () => {
        setAdd(!add);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewNote(prevNote => ({ ...prevNote, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = localStorage.getItem('userEmail');
        setAdd(false);
        setupdate(!update);

        try {
            const res = await fetch('http://localhost:3001/api/createnote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, ...newNote })
            });
            if (!res.ok) {
                throw new Error('Failed to create note');
            }
            const response = await res.json();
            setNotes(response.notes);
            setNewNote({ title: '', body: '', deadline: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (title) => {
        const email = localStorage.getItem('userEmail');

        try {
            const res = await fetch(`http://localhost:3001/api/deletenote/${email}/${title}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) {
                throw new Error('Failed to delete note');
            }
            const response = await res.json();
            setNotes(response.notes);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchMyNotes = async () => {
        const email = localStorage.getItem('userEmail');
        if (!email) {
            setError('User email not found');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`http://localhost:3001/api/notes/${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) {
                throw new Error('Failed to fetch notes');
            }
            const response = await res.json();
            setNotes(response.notes);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('authToken')) {
            fetchMyNotes();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <div>
            {localStorage.getItem("authToken") ? (
                <div>
                    <div>
                        <h2>Your Notes</h2>
                        {notes.length > 0 ? (
                            <ul>
                                {notes.map((note, index) => (
                                    <li key={index}>
                                        <h3>{note.title}</h3>
                                        <p>{note.body}</p>
                                        {note.deadline && <p>Deadline: {note.deadline}</p>}
                                        <button onClick={() => handleDelete(note.title)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No notes found</p>
                        )}
                    </div>
                    <button onClick={handleAdd}>Add</button>
                    {add && (
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="title"
                                value={newNote.title}
                                onChange={handleChange}
                                placeholder="Title"
                                required
                            />
                            <textarea
                                name="body"
                                value={newNote.body}
                                onChange={handleChange}
                                placeholder="Body"
                                required
                            />
                            <input
                                type="date"
                                name="deadline"
                                value={newNote.deadline}
                                onChange={handleChange}
                                placeholder="Deadline"
                            />
                            <button type="submit">Submit</button>
                        </form>
                    )}
                    {error && <p>Error: {error}</p>}
                </div>
            ) : (
                <div>
                    <h2>Welcome</h2>
                    <Link to='/signup'>Signup</Link>
                    <Link to='/login'>Login</Link>
                </div>
            )}
        </div>
    );
}
