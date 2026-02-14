import LogoutButton from "../LogoutButton";

export default function ChatHeader() {
  return (
<<<<<<< HEAD
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-blue-600">Chat Rooms</h1>
      <LogoutButton />
=======
    <div className="flex justify-between items-center mb-0">
      <div className="flex flex-col">
        <h1 className="text-2xl font-black text-slate-100 tracking-tight leading-none">Connect</h1>
        <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.3em] mt-1">Direct Secure Line</p>
      </div>
      <div className="p-1.5 rounded-2xl bg-[#1a1d23] border border-[#2d3139] shadow-inner">
        <LogoutButton />
      </div>
>>>>>>> main
    </div>
  );
}
