import Image from "next/image";
import '../../../styles/chat.css';
import '../../../styles/chat-1.css';
import '../../../styles/chat-2.css';

export default function BlockUserModal({
    show,
    onClose,
    onConfirm
}: {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
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
                        <div className="d-flex mb-3 justify-content-start">
                            <Image
                                src="/assets/img/block-icon.svg"
                                width={48}
                                height={48}
                                alt="Block Icon"
                                loading="lazy"
                            />
                        </div>
                        <h5 className="modal-title fw-semibold fs-5 mb-2">Block User</h5>
                        <p className="text-muted mb-4">
                            Are you sure you want to block <strong>ProBuilds Express</strong>?
                        </p>
                        <div className="d-flex gap-2 justify-content-center">
                            <button
                                type="button"
                                className="btn btn-outline-dark rounded-3 px-4"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn bg-danger rounded-3 px-4 text-white"
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                            >
                                Block
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};