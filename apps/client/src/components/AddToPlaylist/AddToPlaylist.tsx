import { Button } from "@mui/material";
import { useIsGuest } from "../../services/hooks/hooks";
import { setPlaylistContext } from "../../services/redux/modules/playlist/reducer";
import { PlaylistContext } from "../../services/redux/modules/playlist/types";
import { useAppDispatch } from "../../services/redux/tools";
import { isOfflineMode } from "../../services/offline";

interface AddToPlaylistProps {
  context: PlaylistContext;
}

export default function AddToPlaylist({ context }: AddToPlaylistProps) {
  const dispatch = useAppDispatch();
  const isGuest = useIsGuest();
  const offlineMode = isOfflineMode();

  const add = () => {
    dispatch(setPlaylistContext(context));
  };

  if (isGuest || offlineMode) {
    return null;
  }

  return <Button onClick={add}>Create playlist</Button>;
}
