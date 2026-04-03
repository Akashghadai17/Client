import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

export default function Login() {
  const [tab, setTab] = useState('login')
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const navigate = useNavigate()

  if (localStorage.getItem('token')) navigate('/')

  function update(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

  async function handleLogin(e) {
    e.preventDefault()
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 60000); // wait 60 sec for Render wakeup

      const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
        signal: controller.signal

      })
      const data = await res.json()
      if (!res.ok) return setMsg({ text: data.message, type: 'error' })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/')
    } catch { setMsg({ text: 'Server error. Please try again.', type: 'error' }) }
  }

  async function handleRegister(e) {
    e.preventDefault()
    if (form.password.length < 6) return setMsg({ text: 'Password must be at least 6 characters', type: 'error' })
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 60000);

      const res = await fetch(`${API}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
        signal: controller.signal
      })
      const data = await res.json()

      if (!res.ok) {
        return setMsg({ text: data.message, type: 'error' })
      }

// ✅ Registration success (no token yet)
      setMsg({ text: "Account created successfully! Please login.", type: 'success' })

// switch to login tab
      setIsLogin(true)

// clear form
      setForm({ name: "", email: "", password: "" })
      } catch { setMsg({ text: 'Server error. Please try again.', type: 'error' }) }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <i className="fas fa-print text-primary text-4xl"></i>
          <h1 className="text-2xl font-bold text-primary mt-2">StudentPrint</h1>
        </div>
        <div className="flex mb-6 border-b dark:border-gray-700">
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => { setTab(t); setMsg({ text: '', type: '' }) }}
              className={`flex-1 py-2 font-semibold capitalize ${tab === t ? 'text-primary border-b-2 border-primary' : 'text-gray-400 dark:text-gray-500'}`}>
              {t}
            </button>
          ))}
        </div>
        {msg.text && (
          <div className={`mb-4 p-3 rounded-lg text-sm text-center ${msg.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {msg.text}
          </div>
        )}
        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" name="email" required placeholder="you@example.com" onChange={update}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            <input type="password" name="password" required placeholder="••••••••" onChange={update}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">Login</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <input type="text" name="name" required placeholder="Your Name" onChange={update}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            <input type="email" name="email" required placeholder="you@example.com" onChange={update}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            <input type="password" name="password" required placeholder="Min 6 characters" onChange={update}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            <button type="submit" className="w-full bg-secondary text-white py-3 rounded-lg font-bold hover:bg-green-700 transition">Create Account</button>
          </form>
        )}
      </div>
    </div>
  )
}
