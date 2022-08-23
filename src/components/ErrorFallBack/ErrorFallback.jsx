export default function ErrorFallback({ error }) {
    console.log(error)
    return (
        <div role="alert">
            <p>An error occurred:</p>
            <pre>{error.message}</pre>
        </div>
    )
}