import { TransactionItem, Signal } from "@/types/fraud";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { X, Smartphone, CreditCard, ShoppingBag, ShieldAlert, Check, AlertTriangle, XCircle, Info } from "lucide-react";

interface TransactionDrawerProps {
    transaction: TransactionItem | null;
    onClose: () => void;
}

export function TransactionDrawer({ transaction, onClose }: TransactionDrawerProps) {
    if (!transaction) return null;

    // Parse signals safely
    let signals: Signal[] = [];
    try {
        if (transaction.top_signals_json) {
            signals = JSON.parse(transaction.top_signals_json);
        }
    } catch (e) {
        console.error("Failed to parse top_signals_json", e);
    }

    // Parse reasons
    const reasonList = transaction.reasons ? transaction.reasons.split('|').map(r => r.trim()).filter(Boolean) : [];

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="w-full max-w-2xl bg-neutral-950 border-l border-neutral-800 shadow-2xl h-full overflow-y-auto animate-in slide-in-from-right duration-300"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-neutral-800 flex items-center justify-between sticky top-0 bg-neutral-950/95 backdrop-blur z-10">
                    <div>
                        <h2 className="text-xl font-bold">Transaction Details</h2>
                        <p className="text-sm text-neutral-400">Order #{transaction.order_id}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-6 space-y-8">

                    {/* Status Banner */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900 border border-neutral-800">
                        <div className="flex flex-col">
                            <span className="text-sm text-neutral-400 mb-1">Risk Status</span>
                            <div className="flex items-center gap-2">
                                <Badge variant={transaction.risk_level as any} className="text-base px-3 py-1 uppercase">
                                    {transaction.risk_level}
                                </Badge>
                                <span className="text-neutral-500 text-sm">Review recommended: {transaction.recommended_action}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-sm text-neutral-400 mb-1 block">Risk Score</span>
                            <span className={`text-2xl font-bold ${transaction.risk_score > 70 ? 'text-rose-500' :
                                    transaction.risk_score > 20 ? 'text-amber-500' : 'text-emerald-500'
                                }`}>
                                {transaction.risk_score}
                            </span>
                        </div>
                    </div>

                    {/* Key Signals */}
                    <div>
                        <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4" /> Top Risk Signals
                        </h3>
                        <div className="grid gap-3">
                            {signals.length > 0 ? signals.map((sig, idx) => (
                                <div key={idx} className="p-3 rounded-lg bg-neutral-900/50 border border-neutral-800 flex items-start gap-3">
                                    <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                                    <div>
                                        <span className="block font-medium text-neutral-200 text-sm">{sig.signal.replace(/_/g, ' ')}</span>
                                        <span className="block text-xs text-neutral-400 mt-1">{sig.why}</span>
                                        <span className="block text-xs font-mono text-neutral-500 mt-1">Value: {sig.value}</span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-neutral-500 italic">No specific signals recorded.</p>
                            )}
                        </div>
                    </div>

                    {/* Reasons */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Reasons</h3>
                        <ul className="space-y-2">
                            {reasonList.map((reason, idx) => (
                                <li key={idx} className="text-sm text-neutral-300 flex items-start gap-2">
                                    <span className="block mt-1.5 w-1 h-1 rounded-full bg-neutral-500" />
                                    {reason}
                                </li>
                            ))}
                            {reasonList.length === 0 && <li className="text-sm text-neutral-500 italic">No reasons provided.</li>}
                        </ul>
                    </div>

                    {/* Transaction Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-transparent border-neutral-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-neutral-400 uppercase flex items-center gap-2">
                                    <Smartphone className="w-4 h-4" /> Device & User
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between py-1 border-b border-neutral-800/50">
                                    <span className="text-neutral-500">User ID</span>
                                    <span className="font-mono">{transaction.user_id}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-neutral-800/50">
                                    <span className="text-neutral-500">Customer</span>
                                    <span className="font-medium text-neutral-200">{transaction.customer_name}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-neutral-800/50">
                                    <span className="text-neutral-500">Device ID</span>
                                    <span className="font-mono text-xs truncate max-w-[150px]" title={transaction.device_id}>{transaction.device_id}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-transparent border-neutral-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-neutral-400 uppercase flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" /> Payment & Cart
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between py-1 border-b border-neutral-800/50">
                                    <span className="text-neutral-500">Amount</span>
                                    <span className="font-medium text-neutral-200">{formatCurrency(transaction.mrp_gmv)}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-neutral-800/50">
                                    <span className="text-neutral-500">Items</span>
                                    <span className="font-medium text-neutral-200">{transaction.total_items_in_cart}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-neutral-800/50">
                                    <span className="text-neutral-500">Time</span>
                                    <span className="font-mono text-xs">{formatDateTime(transaction.created_at)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Cart Items */}
                    <div>
                        <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" /> Cart Contents
                        </h3>
                        <div className="text-sm text-neutral-300 p-4 rounded-lg bg-neutral-900/30 border border-neutral-800 font-mono leading-relaxed">
                            {transaction.cart_item_names || "No items listed"}
                        </div>
                        <p className="text-xs text-neutral-500 mt-2">Categories: {transaction.cart_item_categories}</p>
                    </div>

                    {/* Ops Notes */}
                    <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
                        <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-2">Ops Decision</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="block text-neutral-500 text-xs">Status</span>
                                <span className="block text-neutral-200">{transaction.ops_status}</span>
                            </div>
                            <div>
                                <span className="block text-neutral-500 text-xs">Notes</span>
                                <span className="block text-neutral-200 italic">{transaction.ops_notes || "None"}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
