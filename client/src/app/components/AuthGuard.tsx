"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("accessToken");
            const isPublicPath = pathname === "/login" || pathname === "/register" || pathname === "/";

            if (!token && !isPublicPath) {
                setAuthorized(false);
                router.push("/login");
            } else {
                setAuthorized(true);
            }
        };

        checkAuth();
    }, [pathname, router]);

    if (!authorized && pathname !== "/login" && pathname !== "/register" && pathname !== "/") {
        return (
            <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return <>{children}</>;
}
