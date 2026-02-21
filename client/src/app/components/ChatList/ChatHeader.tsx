import LogoutButton from "../LogoutButton";

export default function ChatHeader() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Messages</h1>
        <p className="text-[11px] text-[#6e6e6a] font-medium tracking-wide">Direct Secure Line</p>
      </div>
      <div className="flex items-center gap-2">
        <LogoutButton />
      </div>
    </div>
  );
}
