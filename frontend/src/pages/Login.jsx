import LoginForm from '../components/LoginForm'

function Login() {
  return (
    <div className="max-w-md mt-28 mx-auto mt-10 p-6 text-whitebg-gradient-to-br from-slate-900 via-purple-900 to-slate-900  rounded-lg shadow-md my-24" >
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <LoginForm />
    </div>
  )
}

export default Login
