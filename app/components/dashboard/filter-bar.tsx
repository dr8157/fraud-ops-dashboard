import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Search, RotateCw, Filter } from "lucide-react";
import { RiskLevel } from "@/types/fraud";
import { cn } from "@/lib/utils";

interface FilterBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    riskLevel: RiskLevel;
    onRiskLevelChange: (level: RiskLevel) => void;
    onRefresh: () => void;
    loading: boolean;
    lastUpdated: Date | null;
}

export function FilterBar({
    searchTerm,
    onSearchChange,
    riskLevel,
    onRiskLevelChange,
    onRefresh,
    loading,
    lastUpdated
}: FilterBarProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 bg-neutral-900/30 p-4 rounded-xl border border-neutral-800/50">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-4 w-4" />
                <Input
                    placeholder="Search by Order ID, User ID..."
                    className="pl-9 bg-neutral-950/50 border-neutral-800 focus:bg-neutral-900 transition-all"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                    <select
                        className="h-9 w-full md:w-40 appearance-none rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1 text-sm text-neutral-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-300"
                        value={riskLevel}
                        onChange={(e) => onRiskLevelChange(e.target.value as RiskLevel)}
                    >
                        <option value="all">All Levels</option>
                        <option value="pass">Pass</option>
                        <option value="review">Review</option>
                        <option value="block">Block</option>
                    </select>
                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 h-3 w-3 pointer-events-none" />
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    disabled={loading}
                    className="h-9 gap-2 bg-neutral-950 hover:bg-neutral-900 border-neutral-800"
                >
                    <RotateCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
                    Refresh
                </Button>
            </div>
        </div>
    );
}
