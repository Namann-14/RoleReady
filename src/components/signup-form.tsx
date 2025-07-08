'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    fname: "",
    lname: "",
    profile_pic: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Registration failed")
      } else {
        setSuccess("Registration successful! Redirecting to login...")
        setTimeout(() => router.push("/login"), 1500)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Sign up with your email and details below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            {error && (
              <div className="text-sm text-red-600 text-center">{error}</div>
            )}
            {success && (
              <div className="text-sm text-green-600 text-center">{success}</div>
            )}
            <div className="grid gap-3">
              <Label htmlFor="fname">First Name</Label>
              <Input
                id="fname"
                name="fname"
                type="text"
                placeholder="First name"
                value={form.fname}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="lname">Last Name</Label>
              <Input
                id="lname"
                name="lname"
                type="text"
                placeholder="Last name (optional)"
                value={form.lname}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="profile_pic">Profile Picture URL</Label>
              <Input
                id="profile_pic"
                name="profile_pic"
                type="url"
                placeholder="https://example.com/avatar.png"
                value={form.profile_pic}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={form.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Sign up"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </div>
  )
}