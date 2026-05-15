export default function ChatBubble({ role, content }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: role === "user" ? "flex-end" : "flex-start",
        marginBottom: 10,
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          padding: "10px 14px",
          borderRadius: 12,
          background: role === "user" ? "#4f46e5" : "#222",
          color: "white",
        }}
      >
        {content}
      </div>
    </div>
  );
}