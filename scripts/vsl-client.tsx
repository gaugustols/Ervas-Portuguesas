import { hydrateRoot } from "react-dom/client";
import { VslPlayer } from "../components/ui/vsl-player";
import { VIDEO_URL } from "../lib/video-config";

const root = document.getElementById("hero-vsl-root");
if (root) hydrateRoot(root, <VslPlayer videoUrl={VIDEO_URL} />);
