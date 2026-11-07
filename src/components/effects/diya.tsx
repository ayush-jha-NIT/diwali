export function Diya({ small = false, lit = true }: { small?: boolean; lit?: boolean }) {
  return (
    <span className={"diya " + (small ? "diya--small " : "") + (lit ? "" : "diya--unlit")} aria-hidden="true">
      <span className="diya__halo" />
      <span className="diya__flame">
        <span className="diya__flame-core" />
      </span>
      <span className="diya__wick" />
      <span className="diya__bowl" />
      <span className="diya__reflection" />
    </span>
  );
}
