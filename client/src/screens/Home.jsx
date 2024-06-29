import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {localStorage.getItem("authToken") ? (
                <div>
                    <h2>Your Notes</h2>
                    {notes.length > 0 ? (
                        <ul>
                            {notes.map((note, index) => (
                                <li key={index}>
                                    <h3>{note.title}</h3>
                                    <p>{note.body}</p>
                                    {note.deadline && <p>Deadline: {note.deadline}</p>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No notes found</p>
                    )}
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
