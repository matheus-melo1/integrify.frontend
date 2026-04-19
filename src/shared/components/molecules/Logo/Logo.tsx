import { MdSwitchLeft } from "react-icons/md";

export default function Logo() {
  return (
    <div className="flex gap-1 items-center">
      <MdSwitchLeft size={24} className="-translate-y-2" />
      <p className="font-light text-2xl mb-4 ml-2">Integrify</p>
    </div>
  );
}
