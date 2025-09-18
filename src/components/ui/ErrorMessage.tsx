interface ErrorMessageProps {
    message: string;
    className?: string;
}

export function ErrorMessage({ message, className = "" }: ErrorMessageProps) {
    return (
        <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 ${className}`}>
            {message}
        </div>
    );
}