'use client'
import AuthForm from '@/components/AuthForm'
import { checkUser } from '@/utils/auth'

const LoginPage = () => {
  checkUser()
  return (
    <main className="container">
      <AuthForm
        fields={[
          { type: 'email', placeholder: 'Email', name: 'email' },
          {
            type: 'password',
            placeholder: 'Password',
            minLength: 8,
            name: 'password',
          },
        ]}
        details={{
          title: 'Login To Your Account',
          link: 'register',
          linkText: "Don't have an account yet?",
          api: 'login',
        }}
      />
    </main>
  )
}

export default LoginPage
