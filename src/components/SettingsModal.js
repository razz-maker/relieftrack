function SettingsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Preferences</h2>
        <p style={{ color: "var(--muted)" }}>Settings dashboard coming soon...</p>
      </div>
    </div>
  );
}