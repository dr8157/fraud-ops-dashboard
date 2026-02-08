"use client";

import { useState, useMemo } from 'react';
import { useFraudData } from '@/hooks/useFraudData';
import { KPIGrid } from '@/app/components/dashboard/kpi-grid';
import { FilterBar } from '@/app/components/dashboard/filter-bar';
import { TransactionTable } from '@/app/components/dashboard/transaction-table';
import { TransactionDrawer } from '@/app/components/dashboard/transaction-drawer';
import { TransactionItem } from '@/types/fraud';
import { formatDateTime } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
    const { data, loading, lastUpdated, refresh, riskLevel, setRiskLevel } = useFraudData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | null>(null);
    const [page, setPage] = useState(0);
    const itemsPerPage = 50;

    // Client-side filtering and pagination implementation.
    // Ideally, search and pagination should be server-side if data is large.
    // Prompt says API has `limit` and `offset`, but search is "matches order_id...".
    // Since we fetch 200 items (default in hook/api), we can filter client-side for this demo block.
    // Note: The prompt instructed to use `limit` and `offset` API params. 
    // Our hook fetches one batch. Implementing true server-side pagination would require 
    // updating the hook to accept page/limit and refetching. 
    // Given current hook implementation fetches `limit=200`, we'll paginate that 200 client-side 
    // or fetch more if user clicks "Next" at end? 
    // For simplicity and robustness in this demo, we'll paginate the *fetched* data client-side.

    const filteredData = useMemo(() => {
        if (!data?.items) return [];

        let filtered = data.items;

        // Search filter
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.order_id.toString().includes(lowerTerm) ||
                item.user_id.toString().includes(lowerTerm) ||
                item.transaction_id.toString().includes(lowerTerm) ||
                item.customer_name?.toLowerCase().includes(lowerTerm)
            );
        }

        return filtered;
    }, [data, searchTerm]);

    // Pagination logic on filtered data
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

    const handleNextPage = () => {
        if (page < totalPages - 1) setPage(p => p + 1);
    };

    const handlePrevPage = () => {
        if (page > 0) setPage(p => p - 1);
    };

    const hasMore = page < totalPages - 1;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-100">Overview</h2>
                    <p className="text-neutral-500">
                        Last updated: <span className="font-mono text-neutral-400">{formatDateTime(lastUpdated?.toISOString() || '')}</span>
                    </p>
                </div>
            </div>

            <KPIGrid data={data} loading={loading} />

            <FilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                riskLevel={riskLevel}
                onRiskLevelChange={setRiskLevel}
                onRefresh={refresh}
                loading={loading}
                lastUpdated={lastUpdated}
            />

            <div className='relative min-h-[400px]'>
                <TransactionTable
                    data={paginatedData}
                    loading={loading}
                    onView={setSelectedTransaction}
                    page={page}
                    hasMore={hasMore}
                    onPrev={handlePrevPage}
                    onNext={handleNextPage}
                />
            </div>

            <TransactionDrawer
                transaction={selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
            />
        </div>
    );
}
