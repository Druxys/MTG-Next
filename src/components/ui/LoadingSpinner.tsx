interface LoadingSpinnerProps {
    message?: string;
    className?: string;
}

export function LoadingSpinner({ message = "Loading...", className = "" }: LoadingSpinnerProps) {
    return (
        <div className={`flex flex-col justify-center items-center py-12 ${className}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            {message && (
                <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
            )}
        </div>
    );
}