"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchRiskDecisions } from '@/lib/api';
import { RiskDecisionResponse, RiskLevel } from '@/types/fraud';

const POLLING_INTERVAL = 15000; // 15 seconds

export function useFraudData(initialRiskLevel: RiskLevel = 'all') {
    const [data, setData] = useState<RiskDecisionResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [riskLevel, setRiskLevel] = useState<RiskLevel>(initialRiskLevel);

    const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

    const fetchData = useCallback(async (level: RiskLevel = riskLevel) => {
        try {
            // Don't set loading to true on background refresh to avoid UI flickering
            if (!data) setLoading(true);

            const response = await fetchRiskDecisions(level);

            if (response && response.ok) {
                setData(response);
                setLastUpdated(new Date());
                setError(null);
            } else {
                // Keep old data if refresh fails, but set error
                setError('Failed to fetch latest data');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [riskLevel, data]);

    // Initial fetch and polling setup
    useEffect(() => {
        fetchData();

        pollTimerRef.current = setInterval(() => {
            fetchData();
        }, POLLING_INTERVAL);

        return () => {
            if (pollTimerRef.current) {
                clearInterval(pollTimerRef.current);
            }
        };
    }, [fetchData]);

    const refresh = () => {
        // Manual refresh resets the timer
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        fetchData();
        pollTimerRef.current = setInterval(fetchData, POLLING_INTERVAL);
    };

    const updateRiskLevel = (level: RiskLevel) => {
        setRiskLevel(level);
        setLoading(true); // Show loading when filter changes
        // Fetch immediately will be triggered by useEffect change? 
        // Actually our useEffect depends on fetchData which depends on riskLevel. 
        // So changing riskLevel will trigger fetchData via the effect? 
        // The useEffect depends on fetchData. fetchData definition depends on riskLevel. 
        // So yes, updating riskLevel updates fetchData ref, which triggers useEffect.
    };

    return {
        data,
        loading,
        error,
        lastUpdated,
        refresh,
        riskLevel,
        setRiskLevel: updateRiskLevel
    };
}
