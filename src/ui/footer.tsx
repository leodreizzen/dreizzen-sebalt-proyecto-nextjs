import Link from "next/link";
import React from "react";

export function Footer() {
    return (
        <footer className="w-full flex justify-center bg-black gap-x-2 p-1">
              <span className="text-center">
                This is a university project. No real products are being sold -
                This website uses data from <Link className="underline" href="https://rawg.io">RAWG</Link>.
              </span>
        </footer>
    );
}