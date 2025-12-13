import { useProgress } from "@react-three/drei";
import * as React from "react";
import { InfiniteCanvas } from "~/src/infinite-canvas";
import { fetchArticArtworks } from "~/src/infinite-canvas/artic-api";
import type { MediaItem } from "~/src/infinite-canvas/types";
import { PageLoader } from "~/src/page-loader";

export function App() {
  const [media, setMedia] = React.useState<MediaItem[]>([]);
  const [dataLoading, setDataLoading] = React.useState(true);
  const [canvasReady, setCanvasReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [fetchProgress, setFetchProgress] = React.useState(0);

  // Get texture loading progress from drei
  const { active, progress: textureProgress } = useProgress();

  // Combined loading state
  const loading = dataLoading || !canvasReady;

  // Calculate total progress
  const totalProgress = React.useMemo(() => {
    if (dataLoading) {
      // Scale fetch progress to 0-40% (leave room for texture loading)
      return fetchProgress * 0.4;
    }
    // Scale texture progress to 40-100%
    if (canvasReady) return 100;

    // When fetch is done but textures haven't started (e.g. mounting), show 40%
    if (!active && textureProgress === 0) return 40;

    return 40 + textureProgress * 0.6;
  }, [dataLoading, fetchProgress, textureProgress, active, canvasReady]);

  React.useEffect(() => {
    let mounted = true;
    const fetchId = Math.random();

    const fetchAll = async () => {
      try {
        const batchSize = 100;
        const totalToFetch = 500;
        const totalPages = totalToFetch / batchSize;

        let allArtworks: MediaItem[] = [];

        for (let i = 1; i <= totalPages; i++) {
          if (!mounted) break;

          console.log(`[${fetchId}] Fetching batch ${i} of ${totalPages}...`);
          const batch = await fetchArticArtworks(i, batchSize);

          if (!mounted) break;

          allArtworks = [...allArtworks, ...batch];
          setFetchProgress((i / totalPages) * 100);
        }

        if (mounted) {
          if (allArtworks.length === 0) {
            setError("No artworks found from API.");
          } else {
            setMedia(allArtworks);
          }
          setDataLoading(false);
        }
      } catch (err) {
        if (mounted) {
          console.error("Failed to fetch artworks:", err);
          setError(`Failed to load from API: ${err instanceof Error ? err.message : String(err)}`);
          setDataLoading(false);
        }
      }
    };

    fetchAll();

    return () => {
      mounted = false;
    };
  }, []);

  const handleCanvasReady = React.useCallback(() => {
    setCanvasReady(true);
  }, []);

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "sans-serif",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div style={{ color: "red" }}>{error}</div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <PageLoader progress={totalProgress} />
      {/* 
        We only render the canvas if we have media. 
        The PageLoader will cover the screen until loading is done AND the animation finishes.
        Since we fetch all 500 items before setting loading=false, the user will see the full
        set immediately when the loader lifts.
      */}
      {media.length > 0 && <InfiniteCanvas media={media} onReady={handleCanvasReady} />}
    </>
  );
}
