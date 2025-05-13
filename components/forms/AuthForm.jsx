'use client';
import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import '@/app/styles/forms/auth-form.css';
import { toast } from 'react-toastify';
import { login, register } from '@/api/authentication';
import Loader from '@/components/ui/Loader';
import axios from 'axios';

const authFormDetails = {
  login: {
    title: 'Login to your account',
    linkText: "Don't have an account?",
    linkUrl: '/register',
  },
  register: {
    title: 'Register a new account',
    linkText: 'Already have an account?',
    linkUrl: '/login',
  },
};

const AuthForm = ({ fields, type }) => {
  const { title, linkText, linkUrl } = authFormDetails[type];
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({});

  // Validation function for a single field
  const validateField = (field, value) => {
    if (field.required && !value) {
      return `${field.label || field.name} is required`;
    }
    if (field.minLength && value.length < field.minLength) {
      return `${field.label || field.name} must be at least ${field.minLength} characters`;
    }
    if (field.pattern && !new RegExp(field.pattern).test(value)) {
      if (field.name === 'username') {
        return 'Username must start with letter or _ , contain only letters, digits, or _ , and have no spaces';
      }
      if (field.name === 'email') {
        return 'Email must be a valid address (e.g., user@example.com)';
      }
      if (field.name === 'password' || field.name === 'confirmPassword') {
        return "Password mustn't contain spaces";
      }
      return `Invalid ${field.label || field.name} format`;
    }
    return '';
  };

  // Handle input change and validate in real-time
  const handleInputChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));

    const field = fields.find((f) => f.name === name);
    if (field) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Validate all fields on form submission
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    fields.forEach((field) => {
      const value = formValues[field.name] || '';
      const error = validateField(field, value);
      newErrors[field.name] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    return isValid;
  };

  const submitForm = async (event) => {
    event.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    const formData = new FormData(event.currentTarget);

    try {
      setLoading(true);
      if (type === 'register') {
        // Convert username and email to lowercase for register
        const username = formData.get('username')?.toString().toLowerCase();
        const email = formData.get('email')?.toString().toLowerCase();
        if (username) formData.set('username', username);
        if (email) formData.set('email', email);

        await register(formData);
        toast.success('Account created successfully');
      } else if (type === 'login') {
        const data = Object.fromEntries(formData);
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          data,
          { withCredentials: true }
        );
        toast.success('Logged in successfully');
      }
      window.location.replace('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <section className="flex flex-col items-center justify-center gap-4 h-screen">
        <div className="auth-form-container bg-white shadow-lg rounded-lg p-6 w-96 md:w-[600px] lg:w-1/2 min-h-[350px]">
          <form className="flex flex-col gap-4 h-full" onSubmit={submitForm}>
            <h1 className="text-3xl font-bold mb-2 text-primary-500">
              {title}
            </h1>
            {fields.map((field, index) => (
              <div key={index} className="flex flex-col">
                <Input
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  accept={field.accept}
                  minLength={field.minLength}
                  label={field.label ? field.label : field.name}
                  className={
                    field.name === 'username' || field.name === 'email'
                      ? 'lowercase'
                      : ''
                  }
                  pattern={
                    field.name === 'username'
                      ? '^[a-z_][a-z0-9_]*$'
                      : field.pattern
                  }
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}

            <Button type="submit" className="mt-auto">
              {title.split(' ')[0]}
            </Button>

            <p className="text-center text-slate-500">
              {linkText}{' '}
              <Link
                href={linkUrl}
                className="text-sky-500 hover:text-sky-400 transition-all capitalize"
              >
                {linkUrl.split('/').pop()}
              </Link>
            </p>
          </form>
        </div>
        <p className="text-2xl text-primary-500 font-semibold">OR</p>
        <Button
          variant="outline-primary"
          className="w-2/3 sm:w-1/3"
          onClick={() => redirect('/')}
        >
          Go Home
        </Button>
      </section>
    </>
  );
};

export default AuthForm;
