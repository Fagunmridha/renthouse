"use client"

import Link from "next/link"
import { ArrowLeft, FileText, Scale, AlertCircle, CheckCircle, Shield, Users, Ban } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfServicePage() {
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
                <Scale className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Terms of Service</h1>
                <p className="text-muted-foreground mt-1">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Agreement to Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  By accessing or using RentHouse ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, then you may not access the Service.
                </p>
                <p>
                  These Terms apply to all visitors, users, and others who access or use the Service. By using our Service, you agree to comply with and be bound by these Terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  Use of the Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Eligibility</h3>
                  <p>You must be at least 18 years old to use our Service. By using RentHouse, you represent and warrant that you are at least 18 years of age.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Account Registration</h3>
                  <p>To access certain features of the Service, you may be required to register for an account. You agree to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and update your information to keep it accurate</li>
                    <li>Maintain the security of your password and account</li>
                    <li>Accept responsibility for all activities under your account</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Property Listings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Property Owners</h3>
                  <p>If you list a property on RentHouse, you agree to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Provide accurate and truthful information about your property</li>
                    <li>Maintain the property in the condition described</li>
                    <li>Respond promptly to inquiries from potential renters</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>Not discriminate against any potential renters</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Property Renters</h3>
                  <p>When using our Service to find properties, you agree to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Use the Service only for legitimate rental inquiries</li>
                    <li>Provide accurate information when contacting property owners</li>
                    <li>Respect property owners' time and respond appropriately</li>
                    <li>Not engage in fraudulent or deceptive practices</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ban className="h-5 w-5 text-accent" />
                  Prohibited Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>You agree not to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Use the Service for any illegal purpose or in violation of any laws</li>
                  <li>Post false, misleading, or fraudulent information</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Impersonate any person or entity</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Attempt to gain unauthorized access to any portion of the Service</li>
                  <li>Use automated systems to access the Service without permission</li>
                  <li>Collect or harvest information about other users</li>
                  <li>Post spam, unsolicited messages, or advertisements</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-accent" />
                  Disclaimers and Limitations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Service Availability</h3>
                  <p>
                    RentHouse provides a platform for connecting property owners and renters. We do not guarantee the availability, accuracy, or quality of any property listings. We are not a party to any rental agreements between users.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">No Warranty</h3>
                  <p>
                    The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Limitation of Liability</h3>
                  <p>
                    To the maximum extent permitted by law, RentHouse shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-accent" />
                  User Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  You retain ownership of any content you post on the Service, including property listings, messages, and reviews. By posting content, you grant RentHouse a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your content for the purpose of operating and promoting the Service.
                </p>
                <p>
                  You are solely responsible for your content and represent that you have all necessary rights to post such content. We reserve the right to remove any content that violates these Terms or is otherwise objectionable.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  Payment and Fees
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Currently, RentHouse is free to use for both property owners and renters. We reserve the right to introduce fees or charges in the future. If we do so, we will provide advance notice of any changes.
                </p>
                <p>
                  Any transactions between property owners and renters are solely between those parties. RentHouse is not involved in, and is not responsible for, any financial transactions or rental agreements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Termination
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including if you breach these Terms.
                </p>
                <p>
                  You may terminate your account at any time by contacting us or using the account deletion feature in your account settings. Upon termination, your right to use the Service will immediately cease.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Changes to Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
                <p>
                  What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Governing Law
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                </p>
                <p>
                  Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions will remain in full effect.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  If you have any questions about these Terms of Service, please contact us:
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


