import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL; // ✅ direct env usage

export default function Login() {
  const [tab, setTab] = useState('login')
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const navigate = useNavigate()

  if (localStorage.getItem('token')) navigate('/')

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // ✅ LOGIN
  async function handleLogin(e) {
    e.preventDefault()
    try {
      const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        return setMsg({ text: data.message, type: 'error' })
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/')

    } catch (err) {
      console.error(err)
      setMsg({ text: 'Server error. Please try again.', type: 'error' })
    }
  }

  // ✅ REGISTER
  async function handleRegister(e) {
    e.preventDefault()

    if (form.password.length < 6) {
      return setMsg({ text: 'Password must be at least 6 characters', type: 'error' })
    }

    try {
      const res = await fetch(`${API}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        return setMsg({ text: data.message, type: 'error' })
      }

      // ✅ SUCCESS
      setMsg({ text: "Account created successfully! Please login.", type: 'success' })

      // ✅ switch to login tab
      setTab('login')

      // ✅ clear form
      setForm({ name: "", email: "", password: "" })

    } catch (err) {
      console.error(err)
      setMsg({ text: 'Server error. Please try again.', type: 'error' })
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">

        <div className="flex mb-6 border-b">
          {['login', 'register'].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setMsg({ text: '', type: '' }) }}
              className={`flex-1 py-2 font-semibold capitalize ${
                tab === t ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {msg.text && (
          <div className={`mb-4 p-3 rounded text-center ${
            msg.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {msg.text}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <input type="email" name="email" required placeholder="Email" onChange={update} />
            <input type="password" name="password" required placeholder="Password" onChange={update} />
            <button type="submit">Login</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <input type="text" name="name" required placeholder="Name" onChange={update} />
            <input type="email" name="email" required placeholder="Email" onChange={update} />
            <input type="password" name="password" required placeholder="Password" onChange={update} />
            <button type="submit">Register</button>
          </form>
        )}

      </div>
    </div>
  )
}