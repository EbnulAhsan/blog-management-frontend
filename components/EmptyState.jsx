import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data found', description = 'There is nothing to display right now.', action }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 px-4 text-center">
            <div className="rounded-full bg-gray-100 p-4 text-gray-400">
                <Inbox className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">{description}</p>
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}