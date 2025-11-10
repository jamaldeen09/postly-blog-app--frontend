"use client"
import { Github, Twitter, Instagram, Linkedin  } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            icon: <Github className="h-5 w-5" />,
            href: "https://github.com/jamaldeen09",
            label: "GitHub"
        },
        {
            icon: <Twitter className="h-5 w-5" />,
            href: "https://x.com/leaf_papi",
            label: "Twitter"
        },
        {
            icon: <Linkedin className="h-5 w-5" />,
            href: "https://www.linkedin.com/in/jamaldeen-omotoyosi-10b137385/",
            label: "LinkedIn"
        },
        {
            icon: <Instagram className="h-5 w-5" />,
            href: "https://www.instagram.com/jamaldeen.o/",
            label: "Instagram"
        },
    ];

    return (
        <footer className="bg-black text-white">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Main Footer Content */}
                <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8">
                    {/* Brand Section */}
                    <div className="text-center lg:text-left">
                        <h3 className="text-2xl font-bold mb-4">Postly</h3>
                        <p className="text-gray-400 max-w-md">
                            A modern blogging platform built for writers who want to share their stories with the world.
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="flex flex-col items-center lg:items-end">
                        <h4 className="text-lg font-semibold mb-4">Connect With Me</h4>
                        <div className="flex space-x-4">
                            {socialLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300 group"
                                    aria-label={link.label}
                                >
                                    <div className="text-gray-300 group-hover:text-white transition-colors duration-300">
                                        {link.icon}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © {currentYear} Postly. Built with passion and modern web technologies.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;