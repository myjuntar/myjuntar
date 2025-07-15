
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar, Users, TrendingUp, Shield, Headphones } from "lucide-react";
import Link from "next/link";

const VenueOwners = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              List Your Venue on MY JUNTAR
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Join thousands of venue owners who are growing their business with our platform. 
              Reach more customers, manage bookings effortlessly, and increase your revenue.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started Today</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose MY JUNTAR?</h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to grow your venue business
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Building2 className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Easy Listing Management</CardTitle>
                  <CardDescription>
                    Simple tools to showcase your venue with high-quality photos, detailed descriptions, and pricing
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Calendar className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Smart Booking System</CardTitle>
                  <CardDescription>
                    Automated booking management with real-time availability, instant confirmations, and calendar sync
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Reach More Customers</CardTitle>
                  <CardDescription>
                    Access to thousands of event planners and individuals looking for the perfect venue
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Analytics & Insights</CardTitle>
                  <CardDescription>
                    Track your performance with detailed analytics on bookings, revenue, and customer preferences
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Secure Payments</CardTitle>
                  <CardDescription>
                    Fast, secure payment processing with automatic payouts and transparent fee structure
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Headphones className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>24/7 Support</CardTitle>
                  <CardDescription>
                    Dedicated support team to help you maximize your venue's potential and resolve any issues
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
              <p className="text-xl text-muted-foreground">
                Get started in just a few simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">Create Your Account</h3>
                <p className="text-muted-foreground">
                  Sign up and verify your account with our simple registration process
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">List Your Venue</h3>
                <p className="text-muted-foreground">
                  Add photos, descriptions, amenities, and set your pricing and availability
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">Start Earning</h3>
                <p className="text-muted-foreground">
                  Receive bookings, manage your calendar, and get paid automatically
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-muted-foreground">
                No hidden fees, no monthly charges
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="border-primary/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl">Commission-Based Model</CardTitle>
                  <CardDescription className="text-lg">
                    Only pay when you earn
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-6xl font-bold text-primary mb-4">5%</div>
                  <p className="text-xl text-muted-foreground mb-6">
                    Commission per successful booking
                  </p>
                  <ul className="text-left space-y-2 mb-8">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      No setup fees or monthly charges
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Secure payment processing included
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      24/7 customer support
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Marketing and promotion
                    </li>
                  </ul>
                  <Button size="lg" className="w-full" asChild>
                    <Link href="/signup">Start Listing Today</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Grow Your Business?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join MY JUNTAR today and start connecting with customers who are looking for venues just like yours.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Get Started Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default VenueOwners
