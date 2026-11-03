/** Demo logo. Swap /public/logo.svg to rebrand. */
export function Logo({ size = 40 }: { size?: number }) {
  return <img src="/logo.svg" alt="" width={size} height={size} />;
}
