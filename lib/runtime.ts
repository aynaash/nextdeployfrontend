

// edge-runtime.ts
declare global {
  var EdgeRuntime: string | undefined;
}

export const isEdgeRuntime = (): boolean => {
  return (
    typeof globalThis.EdgeRuntime !== 'undefined' ||
    process.env.NEXT_RUNTIME === 'edge'
  );
};

// Optional: Export as default as well
export default isEdgeRuntime;
