import { Notification } from "iconsax-reactjs";

export default function NotificationMenu() {
  return (
    <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 transition-all cursor-pointer bg-[#e9e9ea]">
      <Notification variant='Bold' size={14} />
    </button>
  );
}
