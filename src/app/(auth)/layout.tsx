
import { Logo } from "@/components/logo";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <div className="absolute top-4 left-4 md:top-8 md:left-8">
                <Link href="/" className="flex items-center gap-3">
                    <Logo className="h-8 w-8" />
                    <span className="text-2xl font-bold font-headline text-foreground">
                        TopFreeMail
                    </span>
                </Link>
            </div>
            <div className="w-full pt-20 md:pt-0">
                 {children}
            </div>
        </div>
    );
}
