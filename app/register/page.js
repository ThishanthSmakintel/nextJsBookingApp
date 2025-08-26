'use client'
import RegisterForm from '@/components/RegisterForm'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className=\"min-h-screen flex items-center justify-center p-4\">
      <div className=\"w-full max-w-md\">
        <RegisterForm />
        <div className=\"text-center mt-4\">
          <p>Already have an account? <Link href=\"/login\" className=\"link link-primary\">Login here</Link></p>
        </div>
      </div>
    </div>
  )
}