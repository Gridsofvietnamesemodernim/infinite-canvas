import * as React from "react";
import manifest from "~/src/artworks/manifest.json";
/* I removed the "Frame" import here because we are deleting the text overlay */
import { InfiniteCanvas } from "~/src/infinite-canvas";
import type { MediaItem } from "~/src/infinite-canvas/types";
import { PageLoader } from "~/src/loader";

export function App() {
  const [media] = React.useState<MediaItem[]>(manifest);
  const [textureProgress, setTextureProgress] = React.useState(0);

  if (!media.length) {
    return <PageLoader progress={0} />;
  }

  return (
    <>
      {/* I removed <Frame /> from this line. 
          Now the text, titles, and links are gone. */}
      
      <PageLoader progress={textureProgress} />
      <InfiniteCanvas media={media} onTextureProgress={setTextureProgress} />
    </>
  );
}
