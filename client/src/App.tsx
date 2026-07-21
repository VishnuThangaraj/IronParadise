import { lazy } from "react"

const AuthPage = lazy(() => import('@/features/auth/pages/AuthPage'));

const App = () => {
  return (
    <div>
      <AuthPage/>
    </div>
  )
}

export default App