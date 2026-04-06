"use client";

import React, { useEffect, useRef, useState } from "react";

interface ExpandableHtmlContentProps {
    html: string;
    collapsedHeight?: number;
    className?: string;
}

export default function ExpandableHtmlContent({
    html,
    collapsedHeight = 210,
    className = "",
}: ExpandableHtmlContentProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [expanded, setExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const checkOverflow = () => {
            if (!contentRef.current) {
                return;
            }

            setIsOverflowing(contentRef.current.scrollHeight > collapsedHeight + 8);
        };

        checkOverflow();
        window.addEventListener("resize", checkOverflow);

        return () => {
            window.removeEventListener("resize", checkOverflow);
        };
    }, [collapsedHeight, html]);

    useEffect(() => {
        if (!isOverflowing && expanded) {
            setExpanded(false);
        }
    }, [expanded, isOverflowing]);

    const handleToggle = () => {
        if (expanded) {
            setExpanded(false);

            window.setTimeout(() => {
                const parentSection = containerRef.current?.closest("section[id]");
                const targetId = parentSection?.id;

                if (!targetId) {
                    return;
                }

                const { pathname, search } = window.location;
                window.history.replaceState(null, "", `${pathname}${search}`);
                window.location.hash = targetId;
            }, 50);

            return;
        }

        setExpanded(true);
    };

    return (
        <div ref={containerRef}>
            <div
                ref={contentRef}
                className={className}
                style={{
                    maxHeight: !expanded && isOverflowing ? `${collapsedHeight}px` : "none",
                    overflow: !expanded && isOverflowing ? "hidden" : "visible",
                    transition: "max-height 0.3s ease",
                    marginBottom: isOverflowing ? "2px" : 0,
                }}
                dangerouslySetInnerHTML={{ __html: html }}
            />

            {isOverflowing ? (
                <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none fw-semibold"
                    onClick={handleToggle}
                    aria-expanded={expanded}
                    style={{
                        color: "#111",
                        marginTop: 0,
                        lineHeight: 1.1,
                    }}
                >
                    {expanded ? "See less" : "See more"}
                </button>
            ) : null}
        </div>
    );
}
