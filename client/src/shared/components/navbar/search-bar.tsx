import { SearchNormal1 } from "iconsax-reactjs";

export default function SearchBar() {
  return (
    <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 transition-all cursor-pointer bg-[#e9e9ea]">
      <SearchNormal1 variant='Bold' size={14} />
    </button>
  );
}
