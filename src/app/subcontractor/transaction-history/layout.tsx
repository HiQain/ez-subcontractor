import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Transaction History | EZ Subcontractor",
    description:
        "Review your subscription payments, card details, and transaction history for your EZ Subcontractor account.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function TransactionHistoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
