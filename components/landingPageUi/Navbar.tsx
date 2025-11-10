"use client"
import Link from "next/link";
import Image from "next/image";
import React from "react";

const Navbar = (): React.ReactElement => {

    return (
        <nav
            className="flex items-center justify-between py-3 px-6 top-0 lg:px-20"
        >
            {/* Logo + name */}
            <div className="flex items-center gap-2">
                <Image
                    src="/favicon.svg"
                    alt="postly_logo" 
                    width={50}
                    height={50}
                />
                <p className="text-xl font-bold">Postly</p>
            </div>

            {/* Links */}
            <div
                className="flex items-center gap-6"
            >
                <Link
                    href="#"
                    className="cursor-pointer text-gray-600 text-sm hover:underline"
                >Home</Link>

                <Link
                    href="/#features"
                    className="cursor-pointer text-gray-600 text-sm hover:underline"
                >Features</Link>
            </div>
        </nav>
    );
};

export default Navbar;