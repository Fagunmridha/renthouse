"use client"

import Link from "next/link"
import { ArrowLeft, Shield, Lock, Eye, FileText, Users, Database } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Privacy Policy</h1>
                <p className="text-muted-foreground mt-1">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Welcome to RentHouse ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our rental property platform.
                </p>
                <p>
                  By using RentHouse, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-accent" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
                  <p>We collect information that you provide directly to us, including:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Name, email address, phone number</li>
                    <li>Property listing information (for property owners)</li>
                    <li>Messages and inquiries sent through our platform</li>
                    <li>Account credentials and preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Usage Information</h3>
                  <p>We automatically collect certain information when you use our services:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Browser type and version</li>
                    <li>Device information</li>
                    <li>IP address</li>
                    <li>Pages visited and time spent on pages</li>
                    <li>Search queries and filters used</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-accent" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process property listings and facilitate communication between renters and owners</li>
                  <li>Send you updates, notifications, and respond to your inquiries</li>
                  <li>Personalize your experience and show relevant property listings</li>
                  <li>Detect, prevent, and address technical issues and security threats</li>
                  <li>Comply with legal obligations and enforce our terms of service</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  Information Sharing and Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>With Property Owners:</strong> When you inquire about a property, we share your contact information with the property owner</li>
                  <li><strong>With Renters:</strong> Property owners' contact information is displayed on property listings</li>
                  <li><strong>Service Providers:</strong> We may share information with third-party service providers who assist us in operating our platform</li>
                  <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-accent" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
                <p>
                  We use industry-standard encryption and security practices to safeguard your data. Your passwords are hashed and never stored in plain text.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Your Rights and Choices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Access and update your personal information through your account settings</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt-out of certain communications from us</li>
                  <li>Request a copy of your personal data</li>
                  <li>Object to or restrict certain processing of your information</li>
                </ul>
                <p>
                  To exercise these rights, please contact us at <a href="mailto:support@renthouse.com" className="text-accent hover:underline">support@renthouse.com</a>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Cookies and Tracking Technologies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
                </p>
                <p>
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Children's Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Changes to This Privacy Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
                <p>
                  You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul className="space-y-2 ml-4">
                  <li>
                    <strong>Email:</strong> <a href="mailto:support@renthouse.com" className="text-accent hover:underline">support@renthouse.com</a>
                  </li>
                  <li>
                    <strong>Phone:</strong> <a href="tel:+15551234567" className="text-accent hover:underline">+1 (555) 123-4567</a>
                  </li>
                  <li>
                    <strong>Address:</strong> 123 Main Street, New York, NY 10001
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

