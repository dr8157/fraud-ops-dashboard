import { RiskDecisionResponse } from "@/types/fraud";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Activity, CheckCircle, AlertTriangle, XCircle, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPIGridProps {
    data: RiskDecisionResponse | null;
    loading: boolean;
}

export function KPIGrid({ data, loading }: KPIGridProps) {
    if (!data) return null;

    const total = data.count || 0;
    // Calculate stats from items if possible, or use API provided stats. 
    // API response doesn't give aggregate counts for pass/review/block separately in the root object, 
    // only total count. We must calculate from `items`.
    // Note: API `limit` suggests pagination. If limit < total, these stats are only for the *fetched* page.
    // The prompt implies "passed % = pass / total". If the API doesn't return global stats, we can only compute on visible data.
    // We will compute on `data.items` for now.

    const items = data.items || [];
    const currentCount = items.length;

    const passed = items.filter(i => i.risk_level === 'pass').length;
    const review = items.filter(i => i.risk_level === 'review').length;
    const blocked = items.filter(i => i.risk_level === 'block').length;

    const passedPct = currentCount ? ((passed / currentCount) * 100).toFixed(1) : "0.0";
    const reviewPct = currentCount ? ((review / currentCount) * 100).toFixed(1) : "0.0";
    const blockedPct = currentCount ? ((blocked / currentCount) * 100).toFixed(1) : "0.0";

    const avgRiskScore = currentCount
        ? Math.round(items.reduce((acc, curr) => acc + curr.risk_score, 0) / currentCount)
        : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">

            <KPICard
                title="Total Transactions"
                value={total.toString()}
                subtext="Recent batch"
                icon={Activity}
                iconColor="text-blue-500"
            />

            <KPICard
                title="Passed"
                value={`${passedPct}%`}
                subtext={`${passed} approved`}
                icon={CheckCircle}
                iconColor="text-emerald-500"
            />

            <KPICard
                title="Under Review"
                value={`${reviewPct}%`}
                subtext={`${review} pending`}
                icon={AlertTriangle}
                iconColor="text-amber-500"
                highlight
            />

            <KPICard
                title="Blocked"
                value={`${blockedPct}%`}
                subtext={`${blocked} declined`}
                icon={XCircle}
                iconColor="text-rose-500"
            />

            <KPICard
                title="Avg Risk Score"
                value={avgRiskScore.toString()}
                subtext="0-100 scale"
                icon={TrendingUp}
                iconColor="text-neutral-400"
            />

            {/* Optional: False Positive Rate (Placeholder) */}
        </div>
    );
}

function KPICard({ title, value, subtext, icon: Icon, iconColor, highlight }: any) {
    return (
        <Card className={cn(
            "bg-neutral-900 border-neutral-800 transition-all duration-200 hover:border-neutral-700",
            highlight && "border-amber-500/50 bg-amber-950/10"
        )}>
            <CardContent className="p-6 flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">{title}</p>
                    <div className="text-2xl font-bold text-neutral-100">{value}</div>
                    <p className="text-xs text-neutral-500 mt-1">{subtext}</p>
                </div>
                <div className={cn("p-2 rounded-lg bg-neutral-950/50", iconColor)}>
                    <Icon size={20} />
                </div>
            </CardContent>
        </Card>
    );
}
