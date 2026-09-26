import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
    isOpen,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    isDanger = true,
    onConfirm,
    onCancel,
    loading = false,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center space-x-3">
                    <div className={`rounded-full p-2 ${isDanger ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>

                <p className="mt-3 text-sm text-gray-600">{message}</p>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={onCancel}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        disabled={loading}
                        onClick={onConfirm}
                        className={`rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition disabled:opacity-50 ${isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}