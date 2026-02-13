import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Checkbox, CircularProgress } from "@mui/material";
import clsx from "clsx";
import Text from "../../../components/Text";
import { selectUser } from "../../../services/redux/modules/user/selector";
import { getSpotifyLogUrl } from "../../../services/tools";
import s from "../index.module.css";
import { LocalStorage, REMEMBER_ME_KEY } from "../../../services/storage";
import { useNavigate } from "../../../services/hooks/useNavigate";
import { api } from "../../../services/apis/api";
import { checkLogged } from "../../../services/redux/modules/user/thunk";
import { useAppDispatch } from "../../../services/redux/tools";

interface UserProfile {
  id: string;
  username: string;
}

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const [rememberMe, setRememberMe] = useState(
    LocalStorage.get(REMEMBER_ME_KEY) === "true",
  );
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate("/");
    } else {
      // Load available profiles
      api.getUsersList()
        .then(({ data }) => {
          setProfiles(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load profiles:", err);
          setError("Failed to load user profiles");
          setLoading(false);
        });
    }
  }, [navigate, user]);

  const handleRememberMeClick = async () => {
    const newRememberMe = !rememberMe;
    setRememberMe(newRememberMe);
    if (newRememberMe) {
      LocalStorage.set(REMEMBER_ME_KEY, "true");
    } else {
      LocalStorage.delete(REMEMBER_ME_KEY);
    }
  };

  const handleProfileSelect = async (userId: string) => {
    setLoggingIn(true);
    setError(null);
    try {
      await api.selectUser(userId);
      // Refresh user data
      await dispatch(checkLogged());
      navigate("/");
    } catch (err) {
      console.error("Failed to login:", err);
      setError("Failed to login with selected profile");
      setLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className={s.root}>
        <CircularProgress />
        <Text size="big" className={s.welcome}>
          Loading profiles...
        </Text>
      </div>
    );
  }

  return (
    <div className={s.root}>
      <Text size="pagetitle" element="h1" className={s.title}>
        Login
      </Text>
      <Text size='big' className={s.welcome}>
        Select a profile to continue
      </Text>
      
      {error && (
        <Text size='normal' style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </Text>
      )}

      {profiles.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px' }}>
          {profiles.map(profile => (
            <button
              key={profile.id}
              className={clsx(s.link, s.profileButton)}
              onClick={() => handleProfileSelect(profile.id)}
              disabled={loggingIn}
              style={{
                padding: '1rem',
                fontSize: '1.1rem',
                borderRadius: '8px',
                border: '2px solid var(--primary)',
                background: 'var(--background)',
                color: 'var(--text-on-light)',
                cursor: loggingIn ? 'not-allowed' : 'pointer',
                opacity: loggingIn ? 0.6 : 1,
                transition: 'all 0.2s',
              }}
            >
              {loggingIn ? 'Logging in...' : profile.username}
            </button>
          ))}
        </div>
      ) : (
        <Text size='normal'>
          No profiles available. Please login with Spotify first.
        </Text>
      )}

      <div style={{ marginTop: '2rem' }}>
        <Text size='normal' style={{ marginBottom: '0.5rem' }}>
          Or login with Spotify:
        </Text>
        <a className={s.link} href={getSpotifyLogUrl()}>
          Login with Spotify
        </a>
      </div>
      
      <div>
        <button
          type="button"
          className={clsx("no-button", s.rememberMe)}
          onClick={handleRememberMeClick}>
          <Checkbox
            checked={rememberMe}
            disableRipple
            disableTouchRipple
            disableFocusRipple
            classes={{ root: s.check }}
          />
          <Text size="normal">Remember me</Text>
        </button>
      </div>
    </div>
  );
}
