"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { LayoutDashboard, LogOut, Menu, Users } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavbarProps {
  user: {
    name: string
    role: string
  }
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isAdmin = user.role === "ADMIN"

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5 mr-2" />,
      active: pathname === "/dashboard",
    },
  ]

  if (isAdmin) {
    routes.push({
      href: "/users",
      label: "Users",
      icon: <Users className="h-5 w-5 mr-2" />,
      active: pathname.startsWith("/users"),
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Task Management</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`flex items-center transition-colors hover:text-foreground/80 ${
                  route.active ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/dashboard" className="flex items-center" onClick={() => setOpen(false)}>
              <span className="font-bold">Task Management</span>
            </Link>
            <div className="my-4 flex flex-col space-y-3">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`flex items-center rounded-md px-2 py-1.5 text-sm font-medium ${
                    route.active ? "bg-accent" : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {route.icon}
                  {route.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex items-center">
            <div className="mr-2 hidden md:block">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.role}</div>
            </div>
            <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/login" })}>
              <LogOut className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Log out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

