

export const isEdgeRuntime = () => {
  return typeof EdgeRuntime !== 'undefined' || 
         process.env.NEXT_RUNTIME === 'edge';
}
