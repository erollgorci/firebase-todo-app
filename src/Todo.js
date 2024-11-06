import React, { useState, useEffect } from 'react';
import { db, auth } from './firebaseConfig';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

function Todo({ user }) {
    const [todos, setTodos] = useState([]);
    const [todoInput, setTodoInput] = useState('');

    const todosCollectionRef = collection(db, 'todos');

    useEffect(() => {
        const q = query(todosCollectionRef, where('uid', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const todosList = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setTodos(todosList);
        });
        return unsubscribe;
        // eslint-disable-next-line
    }, [user.uid]);

    const addTodo = async () => {
        if (todoInput.trim() === '') return;
        await addDoc(todosCollectionRef, {
            text: todoInput,
            uid: user.uid,
        });
        setTodoInput('');
    };

    const deleteTodo = async (id) => {
        await deleteDoc(doc(db, 'todos', id));
    };

    const handleSignOut = () => {
        auth.signOut();
        window.location.reload();
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Welcome, {user.email}</h2>
            <button onClick={handleSignOut}>Sign Out</button>
            <br /><br />
            <input
                type="text"
                placeholder="Enter todo"
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
            />
            <button onClick={addTodo}>Add Todo</button>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        {todo.text}{' '}
                        <button onClick={() => deleteTodo(todo.id)} style={{ color: 'red' }}>
                            X
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Todo;