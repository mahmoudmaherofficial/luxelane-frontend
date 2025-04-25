'use client'
import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import '@/app/styles/form.css'
import { useRouter } from 'next/navigation'
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils'
import Loader from '@/components/Loader'
import Cookies from 'js-cookie'
import { login, register } from '@/api/auth'

const AuthForm = ({ fields, details }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const formFields = useMemo(
    () =>
      fields.map((field) => ({
        name: field.name,
        type: field.type,
        required: field.type !== 'file',
        minLength: field.minLength || 0,
        accept: field.accept || undefined,
      })),
    [fields]
  )

  useEffect(() => {
    // Clear accessToken on mount to prevent stale tokens
    Cookies.remove('accessToken')
    const handleLogout = () => {
      console.log('Handling logout event in AuthForm')
      Cookies.remove('accessToken')
      router.push('/login')
    }
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [router])

  const formSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const formData = new FormData(e.target)

      // Send the username with lowercase
      if (formData.get('username')) {
        formData.set('username', formData.get('username').toLowerCase())
      }

      let res
      if (details.api === 'register') {
        console.log(
          'Sending request to register with data:',
          Object.fromEntries(formData)
        )
        res = await register(formData)
      } else if (details.api === 'login') {
        const loginData = {
          email: formData.get('email'),
          password: formData.get('password'),
        }
        console.log('Sending request to login with data:', loginData)
        res = await login(loginData)
      }

      console.log('Received response from', details.api, ':', res)

      if (res?.data?.accessToken) {
        Cookies.set('accessToken', res.data.accessToken, {
          expires: 1 / 96, // 15 minutes
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
        })

        if (details.api === 'login') {
          showSuccessToast('Logged in successfully')
          if (res.data.user.role === 1995 || res.data.user.role === 1996) {
            window.location.replace('/dashboard')
          } else {
            window.location.replace('/')
          }
        } else if (details.api === 'register') {
          showSuccessToast('Account created successfully')
          window.location.replace('/')
        }
      } else {
        showErrorToast('An error occurred. Please try again later.')
      }
    } catch (err) {
      console.error('An error occurred in AuthForm:', err)
      const errorMessage =
        err.response?.data?.error || err.message || 'An error occurred.'
      showErrorToast(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 h-screen">
      {loading && <Loader />}

      <div className="auth-form-container border border-slate-50 bg-slate-50 shadow-lg rounded-lg p-6 w-96 md:w-[600px] lg:w-1/2 min-h-[350px]">
        <form onSubmit={formSubmit} className="flex flex-col gap-4 h-full">
          <h1 className="text-3xl font-bold mb-2 text-slate-900">
            {details.title}
          </h1>

          {formFields.map((field, index) => (
            <div key={index} className="relative w-full">
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                required={field.required}
                placeholder=" "
                accept={field.accept}
                className="peer w-full border border-gray-300 rounded-md px-3 py-2 text-slate-900 text-sm placeholder-transparent focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 peer-invalid:border-red-500 peer-invalid:ring-red-500 peer-valid:border-green-500"
                minLength={field.minLength}
              />
              <label
                htmlFor={field.name}
                className="absolute left-3 -top-2.5 text-sky-500 bg-gray-50 px-1 py-0.5 text-xs transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-1.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-sky-500 peer-focus:bg-gray-50 peer-focus:px-1 peer-focus:py-0.5 peer-invalid:border-red-500"
              >
                {field.name
                  .replace('_', ' ')
                  .replace('profile_image', 'Profile Image')
                  .replace('confirm_password', 'Confirm Password')}
              </label>
            </div>
          ))}

          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-gray-100 rounded p-2 mt-auto"
          >
            {details.title.split(' ')[0]}
          </button>

          <p className="text-center text-slate-500">
            {details.linkText}{' '}
            <Link
              href={`/${details.link}`}
              className="text-sky-500 hover:text-sky-400 transition-all capitalize"
            >
              {details.link}
            </Link>
          </p>
        </form>
      </div>
      <p className="text-2xl font-semibold">OR</p>
      <button
        type="button"
        onClick={() => router.push('/')}
        className="bg-slate-100 hover:bg-slate-50 text-slate-900 rounded p-2 w-96"
      >
        Go Home
      </button>
    </section>
  )
}

export default AuthForm

