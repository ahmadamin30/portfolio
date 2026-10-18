import { FogBackground } from "@/components/ui/fog-background";

export default function DemoFog() {
  return (
    <div className="w-full h-screen">
      <FogBackground className="flex items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-serif text-white tracking-wider">
          PORTFOLIO
        </h1>
      </FogBackground>
    </div>
  );
}
