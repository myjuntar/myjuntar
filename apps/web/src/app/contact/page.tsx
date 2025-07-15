"use client"
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';

const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast({
            title: "Message Sent!",
            description: "We'll get back to you within 24 hours.",
        });

        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });

        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-rose-gold to-primary bg-clip-text text-transparent mb-6">
                        Contact Us
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Have questions about venues or need help planning your perfect wedding? We're here to assist you every step of the way.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-card rounded-lg border p-8">
                        <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="subject">Subject *</Label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="What's this about?"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="message">Message *</Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Tell us how we can help..."
                                    rows={6}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                                variant="elegant"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div className="bg-card rounded-lg border p-8">
                            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-gradient-to-br from-rose-gold to-primary rounded-full p-3">
                                        <MapPin className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Address</h3>
                                        <p className="text-muted-foreground">
                                            123 Wedding Street<br />
                                            Mumbai, Maharashtra 400001<br />
                                            India
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="bg-gradient-to-br from-rose-gold to-primary rounded-full p-3">
                                        <Phone className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Phone</h3>
                                        <p className="text-muted-foreground">+91 98765 43210</p>
                                        <p className="text-muted-foreground">+91 87654 32109</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="bg-gradient-to-br from-rose-gold to-primary rounded-full p-3">
                                        <Mail className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Email</h3>
                                        <p className="text-muted-foreground">info@myjuntar.com</p>
                                        <p className="text-muted-foreground">support@myjuntar.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="bg-gradient-to-br from-rose-gold to-primary rounded-full p-3">
                                        <Clock className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Business Hours</h3>
                                        <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
                                        <p className="text-muted-foreground">Saturday: 10:00 AM - 4:00 PM</p>
                                        <p className="text-muted-foreground">Sunday: Closed</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-lg border p-8">
                            <h3 className="text-xl font-semibold mb-4">Frequently Asked</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-2">How do I book a venue?</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Browse our venues, contact the venue directly, or reach out to us for assistance with booking.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Are the prices negotiable?</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Many venues offer flexible pricing. Contact them directly to discuss your specific requirements.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Do you charge any fees?</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Our platform is free for couples. Venue owners pay a small commission for successful bookings.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact