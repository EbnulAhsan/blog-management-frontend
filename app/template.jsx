// app/template.jsx
export default function Template({ children }) {
    return (
        <div className="animate-page-fade flex min-h-screen flex-col">
            {children}
        </div>
    );
}