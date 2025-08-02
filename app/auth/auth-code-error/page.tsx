import Link from 'next/link';

export default function AuthCodeError() {
    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
            <Link
                href="/"
                className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                >
                    <polyline
                        points="15,18 9,12 15,6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                Back
            </Link>

            <div className="flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-2xl font-bold">Authentication Error</h1>
                    <p className="text-muted-foreground text-center">
                        There was an error during the authentication process.
                        Please try again.
                    </p>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <Link
                        href="/auth/login"
                        className="flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Try Again
                    </Link>
                </div>
            </div>
        </div>
    );
}
