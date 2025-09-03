import { Logo } from "@/components/logo";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <div className="absolute top-8 left-8">
                <Link href="/" className="flex items-center gap-3">
                    <Logo className="h-8 w-8" />
                    <span className="text-2xl font-bold font-headline text-foreground">
                        TopFreeMail
                    </span>
                </Link>
            </div>
            {children}
        </div>
    );
}
