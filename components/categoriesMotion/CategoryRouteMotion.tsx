// components/RouteMotion.tsx
"use client";

import { LayoutGroup, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function RouteMotion({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <LayoutGroup id="menu">
            <AnimatePresence mode="wait" initial={false}>
                <div key={pathname}>{children}</div>
            </AnimatePresence>
        </LayoutGroup>
    );
}