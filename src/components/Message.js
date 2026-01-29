export default function Message({ role, text }) {
  return (
    <div className={`message-row ${role}`}>
      <div className="message-bubble">{text}</div>
    </div>
  );
}
