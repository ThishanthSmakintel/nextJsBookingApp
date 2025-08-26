'use client'
import LoginForm from '@/components/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
        <div className="text-center mt-4">
          <p>Don't have an account? <Link href="/register" className="link link-primary">Register here</Link></p>
        </div>
      </div>
    </div>
  )
}