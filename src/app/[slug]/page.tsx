import { notFound } from "next/navigation";

import HomeAffiliatePage from "../home-affiliate/page";
import HomeGeneralContractorPage from "../home-general-contractor/page";
import HomeGeneralContractor2Page from "../home-general-contractor2/page";
import HomeSubcontractorPage from "../home-subcontractor/page";

type DynamicLandingPageProps = {
    params: {
        slug: string;
    };
};

const hasLocationSuffix = (slug: string, prefix: string) =>
    slug.startsWith(prefix) && slug.length > prefix.length;

export default function DynamicLandingPage({ params }: DynamicLandingPageProps) {
    const { slug } = params;

    if (hasLocationSuffix(slug, "home-general-contractor2-")) {
        return <HomeGeneralContractor2Page />;
    }

    if (hasLocationSuffix(slug, "home-general-contractor-")) {
        return <HomeGeneralContractorPage />;
    }

    if (hasLocationSuffix(slug, "home-subcontractor-")) {
        return <HomeSubcontractorPage />;
    }

    if (hasLocationSuffix(slug, "home-affiliate-")) {
        return <HomeAffiliatePage />;
    }

    notFound();
}
