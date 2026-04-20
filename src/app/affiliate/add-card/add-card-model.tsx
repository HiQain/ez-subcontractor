import { CardElement } from "@stripe/react-stripe-js";

export default function AddCardModal({
    email,
    name,
    onClose,
    onConfirm,
    loading
}) {
    return (
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4">
                    <div className="modal-header">
                        <h5 className="modal-title fw-semibold">Add New Card</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        />
                    </div>

                    <div className="modal-body">
                        <div className="input-wrapper mb-3">
                            <label className="fw-semibold mb-1">Full Name *</label>
                            <input
                                type="text"
                                value={name}
                                disabled
                            />
                        </div>

                        <div className="input-wrapper mb-3">
                            <label className="fw-semibold mb-1">Email *</label>
                            <input
                                type="email"
                                value={email}
                                disabled
                            />
                        </div>

                        <div className="input-wrapper">
                            <label className="fw-semibold mb-1">Card Details *</label>
                            <div
                                style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    background: '#fff',
                                }}
                            >
                                <CardElement
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: '16px',
                                                color: '#000',
                                                '::placeholder': { color: '#999' },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            className="btn btn-primary d-flex align-items-center gap-2"
                            onClick={onConfirm}
                            disabled={loading}
                        >
                            {loading && (
                                <span className="spinner-border spinner-border-sm" />
                            )}
                            {loading ? 'Adding...' : 'Add Card'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}