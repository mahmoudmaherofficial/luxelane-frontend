import AuthForm from '@/components/AuthForm'

const RegisterPage = () => {
  return (
    <main className="container">
      <AuthForm
        fields={[
          {
            type: 'text',
            minLength: 4,
            name: 'username',
          },
          { type: 'email', name: 'email' },
          { type: 'file', name: 'image' },
          {
            type: 'password',
            minLength: 8,
            name: 'password',
          },
          {
            type: 'password',
            minLength: 8,
            name: 'confirmPassword',
          },
        ]}
        details={{
          title: 'Register New Account',
          link: 'login',
          linkText: 'Already have an account?',
          api: 'register',
        }}
      />
    </main>
  )
}

export default RegisterPage
