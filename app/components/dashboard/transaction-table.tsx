import { TransactionItem } from "@/types/fraud";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Eye, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface TransactionTableProps {
    data: TransactionItem[];
    loading: boolean;
    onView: (item: TransactionItem) => void;
    page: number;
    hasMore: boolean;
    onNext: () => void;
    onPrev: () => void;
}

export function TransactionTable({
    data,
    loading,
    onView,
    page,
    hasMore,
    onNext,
    onPrev
}: TransactionTableProps) {

    const getRiskBadge = (level: string) => {
        switch (level) {
            case 'pass': return <Badge variant="success">PASS</Badge>;
            case 'review': return <Badge variant="warning">REVIEW</Badge>;
            case 'block': return <Badge variant="danger">BLOCK</Badge>;
            default: return <Badge variant="secondary">{level}</Badge>;
        }
    };

    const getRiskScoreColor = (score: number) => {
        if (score < 20) return "bg-emerald-500";
        if (score < 70) return "bg-amber-500";
        return "bg-rose-500";
    };

    return (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-neutral-400 uppercase bg-neutral-900/80 border-b border-neutral-800">
                        <tr>
                            <th className="px-6 py-4 font-medium">Order ID</th>
                            <th className="px-6 py-4 font-medium">User ID</th>
                            <th className="px-6 py-4 font-medium">Risk Score</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Amount</th>
                            <th className="px-6 py-4 font-medium">Device</th>
                            <th className="px-6 py-4 font-medium">Timestamp</th>
                            <th className="px-6 py-4 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/50">
                        {loading && data.length === 0 ? (
                            // Skeleton loading state
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse bg-neutral-900/20">
                                    <td className="px-6 py-4"><div className="h-4 w-24 bg-neutral-800 rounded"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 w-20 bg-neutral-800 rounded"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 w-32 bg-neutral-800 rounded"></div></td>
                                    <td className="px-6 py-4"><div className="h-6 w-16 bg-neutral-800 rounded-full"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 w-16 bg-neutral-800 rounded"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 w-24 bg-neutral-800 rounded"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 w-32 bg-neutral-800 rounded"></div></td>
                                    <td className="px-6 py-4"><div className="h-8 w-16 bg-neutral-800 rounded ml-auto"></div></td>
                                </tr>
                            ))
                        ) : data.length > 0 ? (
                            data.map((item) => (
                                <tr key={`${item.order_id}-${item.transaction_id}`} className="hover:bg-neutral-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-neutral-200">
                                        <div className="flex flex-col">
                                            <span>ORD-{item.order_id}</span>
                                            <span className="text-xs text-neutral-500 font-normal">TXN-{item.transaction_id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-400">USR-{item.user_id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-neutral-200">{item.risk_score}</span>
                                            <div className="h-1.5 w-16 bg-neutral-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${getRiskScoreColor(item.risk_score)}`}
                                                    style={{ width: `${Math.min(item.risk_score, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getRiskBadge(item.risk_level)}
                                    </td>
                                    <td className="px-6 py-4 text-neutral-200 font-medium">
                                        {formatCurrency(item.mrp_gmv || item.item_cost)}
                                    </td>
                                    <td className="px-6 py-4 text-neutral-500 font-mono text-xs">
                                        {item.device_id?.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 text-neutral-400 text-xs">
                                        {formatDateTime(item.created_at || item.order_date + " " + item.order_timestamp)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onView(item)}
                                            className="text-neutral-400 hover:text-neutral-100"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-neutral-500">
                                    No transactions found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 bg-neutral-900/80 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-neutral-500">
                    Page {page + 1}
                </span>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onPrev}
                        disabled={page === 0}
                        className="h-8 text-xs"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onNext}
                        disabled={!hasMore} // Simple check if we probably have more
                        className="h-8 text-xs"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
