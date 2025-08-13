import Link from "next/link";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { CheckCircle, Clock, BarChart3, Users, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">TaskFlow Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Manage Tasks & Projects
            <span className="text-blue-600 block">Like a Pro</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Complete task and project management solution with advanced productivity features, 
            time tracking, analytics, and team collaboration tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to stay productive
            </h3>
            <p className="text-lg text-gray-600">
              Powerful features designed to help you and your team achieve more
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-blue-600 mb-4" />
                <CardTitle>Task Management</CardTitle>
                <CardDescription>
                  Create, organize, and track tasks with priorities, deadlines, and subtasks
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 text-green-600 mb-4" />
                <CardTitle>Time Tracking</CardTitle>
                <CardDescription>
                  Built-in Pomodoro timer and time tracking for better productivity insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-purple-600 mb-4" />
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>
                  Detailed analytics and reports to track your productivity and progress
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-orange-600 mb-4" />
                <CardTitle>Project Collaboration</CardTitle>
                <CardDescription>
                  Organize tasks into projects and collaborate with your team effectively
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-yellow-600 mb-4" />
                <CardTitle>Multiple Views</CardTitle>
                <CardDescription>
                  Switch between list, kanban, calendar, and timeline views as needed
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-red-600 mb-4" />
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>
                  Your data is secure with enterprise-grade security and regular backups
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to boost your productivity?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who have transformed their workflow with TaskFlow Pro
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <CheckCircle className="h-6 w-6 text-blue-400 mr-2" />
              <span className="text-lg font-semibold">TaskFlow Pro</span>
            </div>
            <div className="text-gray-400">
              © 2024 TaskFlow Pro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
