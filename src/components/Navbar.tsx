import Link from "next/link";
import Button from "./ui/Button";

export default function Navbar() {
  return (
    <div className="flex gap-3">
      <Link href="/">
        <Button>Dashboard</Button>
      </Link>

      <Link href="/projects">
        <Button>Projects</Button>
      </Link>

      <Link href="/data">
        <Button>Data</Button>
      </Link>

      <Link href="/ivion">
        <Button>IVION</Button>
      </Link>
    </div>
  );
}