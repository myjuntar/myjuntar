import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Heart, Users, MapPin, Award } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-rose-gold to-primary bg-clip-text text-transparent mb-6">
                        About MY JUNTAR
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        We're passionate about making your dream wedding come true by connecting you with the perfect venues across India.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                        <p className="text-muted-foreground mb-4">
                            At MY JUNTAR, we believe every couple deserves a perfect wedding venue that reflects their unique love story. Our platform connects couples with carefully curated wedding venues across India, making the venue selection process simple, transparent, and stress-free.
                        </p>
                        <p className="text-muted-foreground">
                            We work directly with venue owners to ensure accurate information, competitive pricing, and exceptional service for your special day.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-rose-gold-light to-primary-light rounded-lg p-8">
                        <Heart className="h-12 w-12 text-primary mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Making Dreams Reality</h3>
                        <p className="text-sm text-muted-foreground">
                            From intimate gatherings to grand celebrations, we help you find the perfect venue that matches your vision and budget.
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    <div className="text-center">
                        <div className="h-16 w-16 bg-gradient-to-br from-rose-gold to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold">500+</h3>
                        <p className="text-muted-foreground">Venues Listed</p>
                    </div>
                    <div className="text-center">
                        <div className="h-16 w-16 bg-gradient-to-br from-rose-gold to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold">10,000+</h3>
                        <p className="text-muted-foreground">Happy Couples</p>
                    </div>
                    <div className="text-center">
                        <div className="h-16 w-16 bg-gradient-to-br from-rose-gold to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Award className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold">50+</h3>
                        <p className="text-muted-foreground">Cities Covered</p>
                    </div>
                    <div className="text-center">
                        <div className="h-16 w-16 bg-gradient-to-br from-rose-gold to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold">5 Years</h3>
                        <p className="text-muted-foreground">Experience</p>
                    </div>
                </div>

                {/* Values Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6 rounded-lg border">
                            <h3 className="text-xl font-semibold mb-4">Transparency</h3>
                            <p className="text-muted-foreground">
                                Clear pricing, honest reviews, and accurate venue information to help you make informed decisions.
                            </p>
                        </div>
                        <div className="text-center p-6 rounded-lg border">
                            <h3 className="text-xl font-semibold mb-4">Quality</h3>
                            <p className="text-muted-foreground">
                                Every venue is personally verified by our team to ensure it meets our high standards for your special day.
                            </p>
                        </div>
                        <div className="text-center p-6 rounded-lg border">
                            <h3 className="text-xl font-semibold mb-4">Support</h3>
                            <p className="text-muted-foreground">
                                Our dedicated team is here to assist you throughout your venue selection and booking process.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About