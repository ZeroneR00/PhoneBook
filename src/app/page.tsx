import Image from "next/image";
import MainComponent from "./components/MainComponent";

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-8 bg-gray-800 text-gray-200">
      <MainComponent />
    </div>
  );
}
