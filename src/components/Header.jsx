"use client"
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { BarLoader } from "react-spinners";
import headerLogo from "../../public/logos/logo.png"
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";

function Header() {
    const path =usePathname()
    const{isLoading, isAuthenticated} =  useStoreUserEffect()
    return ( 
        <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur border-b supports-[backdrop-filter]:bg-white/55 ">
            <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image 
                    src={headerLogo}
                    className="h-11 w-auto object-contain"
                    width={ 200}
                    height={60}
                    alt={"logo"}
                    />
                </Link>
                {path=="/sign-in"&&
                    (
                    
                        <Badge variant={"outline"} className="bg-green-100 text-green-700 flex-col items-start justify-center text-sm">
                            <p>Test Id : xyz@abcd.com </p>
                            <p>Test Pass : abcd1234</p>
                        </Badge>
                    
                    )
                }
                {path == "/" && 
                <div className="hidden md:flex items-center gap-6 ">
                    <Link href={"#features"} className="text-sm font-medium hover:text-green-500 transition">
                        Features
                    </Link>
                    <Link href={"#how-it-works"} className="text-sm font-medium hover:text-green-500 transition">
                        How It Works
                    </Link>
                </div>
                }
                <div className="flex items-center gap-4">
                    <Authenticated>
                        <Link href={"/dashboard"} >
                            <Button variant={"outline"} className="hidden md:inline-flex items-center gap-2 cursor-pointer hover:text-green-600 hover:border-green-600 transition">
                                <LayoutDashboard/>
                                Dashboard
                            </Button>
                            <Button variant={"ghost"} className={"md:hidden w-10 h-10 p-0"}>
                                <LayoutDashboard className="h-4 w-4"/>
                            </Button>
                        </Link>
                        <UserButton/>
                    </Authenticated>
                    <Unauthenticated>
                        <SignInButton>
                            <Button className="cursor-pointer"variant={"ghost"}>Sign In</Button>
                        </SignInButton>
                        <SignUpButton>
                            <Button  className="bg-green-400 hover:bg-green-700  cursor-pointer">Get Started</Button>
                        </SignUpButton>
                    </Unauthenticated>
                </div>
            </nav>
            {isLoading && <BarLoader width={"100%"} color="#1df2bd" /> }
        </header>
     );
}

export default Header;