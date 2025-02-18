
import { Background, Controls, MiniMap } from '@xyflow/react';

export function FlowBackground() {
  return (
    <>
      <Background gap={15} />
      <Controls />
      <MiniMap />
    </>
  );
}
