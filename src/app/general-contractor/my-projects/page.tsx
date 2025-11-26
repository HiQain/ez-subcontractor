'use client';

import { useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/free-trial.css';

export default function DashboardPage() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("all");
    const [expandedCards, setExpandedCards] = useState<number[]>([]);

    const toggleCard = (index: number) => {
        setExpandedCards((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const allProjects = [
        {
            id: 1,
            title: "Whittier, CA",
            status: "Hired",
            statusColor: "#007AFF",
            description:
                "Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish. Must bring own equipment and provide material estimate.",
        },
        {
            id: 2,
            title: "Los Angeles, CA",
            status: "Active",
            statusColor: "#61BA47",
            description:
                "Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish. Must bring own equipment and provide material estimate.",
        },
    ];

    const hiredProjects = allProjects.filter((p) => p.status === "Hired");
    const activeProjects = allProjects.filter((p) => p.status === "Active");

    const getProjects = () => {
        if (activeTab === "all") return allProjects;
        if (activeTab === "hired") return hiredProjects;
        if (activeTab === "active") return activeProjects;
        return [];
    };

    const handleViewDetails = () => {
        router.push('/general_contractor/job-details');
    };

    return (
        <>
            <Header />
            <section className="banner-sec trial review">
                <div className="container">
                    <div className="right-bar">
                        {/* Header Bar */}
                        <div className="bar d-flex align-items-center gap-2 justify-content-between flex-wrap mb-4">
                            <div className="fs-4 fw-semibold">My Projects</div>
                        </div>

                        {/* Tabs */}
                        <ul className="nav nav-tabs mb-4" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${activeTab === "all" ? "active" : ""}`}
                                    type="button"
                                    onClick={() => setActiveTab("all")}
                                >
                                    All
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${activeTab === "hired" ? "active" : ""}`}
                                    type="button"
                                    onClick={() => setActiveTab("hired")}
                                >
                                    Hired
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${activeTab === "active" ? "active" : ""}`}
                                    type="button"
                                    onClick={() => setActiveTab("active")}
                                >
                                    Active
                                </button>
                            </li>
                        </ul>

                        {/* Tab Content */}
                        <div className="tab-content">
                            {["all", "hired", "active"].map((tab) => {
                                const projects =
                                    tab === "all"
                                        ? allProjects
                                        : tab === "hired"
                                            ? hiredProjects
                                            : activeProjects;

                                return (
                                    <div
                                        key={tab}
                                        className={`tab-pane fade ${activeTab === tab ? "show active" : ""}`}
                                        role="tabpanel"
                                    >
                                        <div className="row g-4">
                                            {projects.map((project, index) => (
                                                <div className="col-lg-6" key={project.id}>
                                                    <div className="project-card call-dark custom-card p-4">
                                                        <div className="bar d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                                                            <div className="fs-5 fw-semibold">{project.title}</div>
                                                            <div
                                                                className="btn p-1 ps-3 pe-3"
                                                                style={{
                                                                    backgroundColor: `${project.statusColor}10`,
                                                                    color: project.statusColor,
                                                                }}
                                                            >
                                                                {project.status}
                                                            </div>
                                                        </div>

                                                        <p className="description mb-0">
                                                            {expandedCards.includes(index)
                                                                ? project.description
                                                                : project.description.slice(0, 120) + "..."}
                                                        </p>
                                                        <button
                                                            className="see-more-btn mb-3 d-block"
                                                            onClick={() => toggleCard(index)}
                                                        >
                                                            {expandedCards.includes(index) ? "See less" : "See more"}
                                                        </button>

                                                        <div className="buttons d-flex align-items-center gap-2 flex-wrap-md">
                                                            {/* ✅ View Details */}
                                                            <button
                                                                className="btn btn-primary rounded-3 w-100 justify-content-center"
                                                                onClick={handleViewDetails}
                                                            >
                                                                View Details
                                                            </button>
                                                            <button className="btn bg-dark text-white rounded-3 w-100 justify-content-center">
                                                                Edit
                                                            </button>
                                                            <button className="btn bg-danger text-white rounded-3 w-100 justify-content-center">
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
