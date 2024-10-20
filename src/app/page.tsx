'use client';

import { useEffect, useState } from 'react';

interface User {
  id: number;
  matricula: string;
  name: string;
  email: string;
  role: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    matricula: '',
    name: '',
    email: '',
    role: '',
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    if (res.ok) {
      fetchUsers();
      setNewUser({ matricula: '', name: '', email: '', role: '' });
    }
  };

  const handleEditUser = async (user: User) => {
    setEditingUser(user);
    setNewUser({
      matricula: user.matricula,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleUpdateUser = async (event: React.FormEvent) => {
    event.preventDefault();

    if (editingUser) {
      const res = await fetch(`/api/users`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingUser.id, ...newUser }),
      });

      if (res.ok) {
        fetchUsers();
        setEditingUser(null);
        setNewUser({ matricula: '', name: '', email: '', role: '' });
      }
    }
  };

  const handleDeleteUser = async (id: number) => {
    const res = await fetch(`/api/users`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      fetchUsers();
    }
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='bg-white p-5 w-screen text-center'>
        <h1 className='text-zinc-800 font-bold text-3xl'>Cadastro de Usuários</h1>
      </div>
      <form onSubmit={editingUser ? handleUpdateUser : handleAddUser} className='grid grid-cols-2 gap-4 m-4'>
        <input
          className='py-2 px-4 rounded-md border-none text-zinc-600'
          type="text"
          placeholder="Matrícula"
          value={newUser.matricula}
          onChange={(e) => setNewUser({ ...newUser, matricula: e.target.value })}
          required
        />
        <input
          className='py-2 px-4 rounded-md border-none text-zinc-600'
          type="text"
          placeholder="Nome"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          required
        />
        <input
          className='py-2 px-4 rounded-md border-none text-zinc-600'
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
        <input
          className='py-2 px-4 rounded-md border-none text-zinc-600'
          type="text"
          placeholder=" Cargo"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          required
        />

        <button
          className={`bg-blue-600 text-white font-semibold py-2 px-4 rounded-md 
              transition duration-200 ease-in-out 
              hover:bg-blue-700 focus:outline-none focus:ring-2 
              focus:ring-blue-500 focus:ring-opacity-50`}
          type="submit"
        >
          {editingUser ? 'Atualizar Usuário' : 'Adicionar Usuário'}
        </button>

      </form>
      <div className='bg-white m-5 p-5 w-screen text-center'>
        <h1 className='text-zinc-800 font-bold text-3xl'>Lista de Usuários</h1>
      </div>

      <ul>
        {users.map((user) => (
          <li key={user.id} className="grid grid-cols-4 gap-4 p-2 border-b"> {/* Cria um grid com 4 colunas */}
            <span>Matrícula: {user.matricula}</span>
            <span>Nome: {user.name}</span>
            <span>Email: {user.email}</span>
            <span>Papel: {user.role}</span>
            <div className="flex justify-between">
              <button
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                onClick={() => handleEditUser(user)}
              >
                Editar
              </button>
              <button
                className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition duration-200"
                onClick={() => handleDeleteUser(user.id)}
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>



    </div>
  );
}
