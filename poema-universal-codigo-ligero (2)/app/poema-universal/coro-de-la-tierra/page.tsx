import type { Metadata } from "next";
import CoroExperience from "./CoroExperience";
import "./coro-globals.css";

export const metadata: Metadata = {
  title: "El Coro de la Tierra · Poema Universal",
  description:
    "Una sala viva donde las voces del mundo orbitan una misma tierra.",
};

export default function CoroDeLaTierraPage() {
  return <CoroExperience />;
}
