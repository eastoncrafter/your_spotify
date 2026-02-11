import { PlayArrow } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import clsx from "clsx";
import { playTrack } from "../../services/redux/modules/user/thunk";
import { useAppDispatch } from "../../services/redux/tools";
import { SpotifyImage } from "../../services/types";
import { isOfflineMode } from "../../services/offline";
import IdealImage from "../IdealImage";
import s from "./index.module.css";

interface PlayButtonProps {
  id: string;
  covers: SpotifyImage[];
  className?: string;
}

export default function PlayButton({ id, covers, className }: PlayButtonProps) {
  const dispatch = useAppDispatch();
  const offlineMode = isOfflineMode();

  const play = () => {
    dispatch(playTrack(id));
  };

  // Don't show play button in offline mode
  if (offlineMode) {
    return (
      <div className={clsx(s.root, className)}>
        <IdealImage
          images={covers}
          size={48}
          className={clsx("play-image", s.image)}
        />
      </div>
    );
  }

  return (
    <div className={clsx(s.root, className)}>
      <IdealImage
        images={covers}
        size={48}
        className={clsx("play-image", s.image)}
      />
      <IconButton onClick={play} className="play-button">
        <PlayArrow className={s.icon} />
      </IconButton>
    </div>
  );
}
