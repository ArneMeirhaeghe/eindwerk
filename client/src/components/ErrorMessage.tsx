// File: src/components/ErrorMessage.tsx

interface ErrorMessageProps {
  message: string
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return <div className="text-red-500 mb-4">{message}</div>
}
