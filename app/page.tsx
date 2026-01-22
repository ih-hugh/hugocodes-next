import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Timeline } from "@/components/sections/timeline";
import { Skills } from "@/components/sections/skills";
import { Education } from "@/components/sections/education";
import { Contact } from "@/components/sections/contact";
import { CircuitBoard } from "@/components/ui/circuit-board";

export default function Page() {
  return (
    <main className="relative" style={{ backgroundColor: "var(--cyber-dark)" }}>
      {/* Global circuit board background */}
      <CircuitBoard
        className="fixed inset-0 z-0"
        opacity={0.4}
        color="cyan"
      />

      {/* Content sections */}
      <div className="relative z-10">
        <section id="hero"><Hero /></section>
        <section id="about"><About /></section>
        <section id="projects"><Projects /></section>
        <section id="experience"><Timeline /></section>
        <section id="skills"><Skills /></section>
        <section id="education"><Education /></section>
        <section id="contact"><Contact /></section>
      </div>
    </main>
  );
}
