'use client'
import React from 'react'
import AuthForm from '@/components/AuthForm'
import { checkUser } from '@/utils/auth'

const RegisterPage = () => {
  checkUser()
  return (
    <main className="container">
      <AuthForm
        fields={[
          {
            type: 'text',
            placeholder: 'Username',
            minLength: 4,
            name: 'username',
          },
          { type: 'email', placeholder: 'Email', name: 'email' },
          { type: 'file', placeholder: 'Profile Image', name: 'image' },
          {
            type: 'password',
            placeholder: 'Password',
            minLength: 8,
            name: 'password',
          },
          {
            type: 'password',
            placeholder: 'Confirm Password',
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
