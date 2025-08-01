import { Goku } from "@/app/(marketing)/page";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between h-screen">
            <div className="hidden lg:block lg:w-1/2 h-full bg-black">
                <Goku />
            </div>
            <div className="w-full lg:w-1/2 h-full flex items-center justify-center px-2 md:px-0">
                {children}
            </div>
        </div>
    );
}