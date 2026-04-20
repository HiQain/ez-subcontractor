import Image from "next/image";
import '../../../../styles/chat.css';
import '../../../../styles/chat-1.css';
import '../../../../styles/chat-2.css';

export default function CancelSubscriptionModal({
    show,
    onClose,
    onConfirm,
    planName = "this subscription",
}: {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    planName?: string;
}) {
    if (!show) return null;

    return (
        <div
            className="modal fade show"
            style={{
                display: 'block',
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 1050,
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
            }}
            onClick={onClose}
        >
            <div
                className="modal-dialog modal-dialog-centered"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content">
                    <div className="modal-body p-4">

                        {/* Icon */}
                        <div className="d-flex mb-3 justify-content-start">
                            <Image
                                src="/assets/img/block-icon.svg"
                                width={48}
                                height={48}
                                alt="Cancel Subscription Icon"
                                loading="lazy"
                            />
                        </div>

                        {/* Title */}
                        <h5 className="modal-title fw-semibold fs-5 mb-2">
                            Cancel Subscription
                        </h5>

                        {/* Description */}
                        <p className="text-muted mb-4">
                            Are you sure you want to cancel <strong>{planName}</strong>?
                            You will continue to have access until the end of your billing cycle.
                        </p>

                        {/* Actions */}
                        <div className="d-flex gap-2 justify-content-center">
                            <button
                                type="button"
                                className="btn btn-outline-dark rounded-3 px-4"
                                onClick={onClose}
                            >
                                Keep Subscription
                            </button>

                            <button
                                type="button"
                                className="btn bg-danger rounded-3 px-4 text-white"
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                            >
                                Cancel Subscription
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
