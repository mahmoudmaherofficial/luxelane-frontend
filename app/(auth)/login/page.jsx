'use client'
import AuthForm from '@/components/AuthForm'

const LoginPage = () => {
  return (
    <main className="container">
      <AuthForm
        fields={[
          { type: 'email', name: 'email' },
          {
            type: 'password',
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