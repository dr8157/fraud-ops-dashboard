import { RiskDecisionResponse, TransactionItem, RiskLevel } from "@/types/fraud";

const API_BASE_URL = "https://deepak8157.app.n8n.cloud/webhook/risk-decisions";

export async function fetchRiskDecisions(
    riskLevel: RiskLevel = 'all',
    limit: number = 200,
    offset: number = 0
): Promise<RiskDecisionResponse | null> {
    try {
        const url = new URL(API_BASE_URL);
        url.searchParams.append('risk_level', riskLevel);
        url.searchParams.append('limit', limit.toString());
        url.searchParams.append('offset', offset.toString());

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error('API Error:', response.status, response.statusText);
            return null;
        }

        const data = await response.json();
        // The API returns an array [{ ok: true, ... }] based on the sample.
        // We need to handle if it returns an array or object.
        const result = Array.isArray(data) ? data[0] : data;

        return result as RiskDecisionResponse;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}
