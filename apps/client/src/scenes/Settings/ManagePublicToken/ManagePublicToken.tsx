import { Button } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Dialog from "../../../components/Dialog";
import Text from "../../../components/Text";
import TitleCard from "../../../components/TitleCard";
import { alertMessage } from "../../../services/redux/modules/message/reducer";
import { selectAccounts } from "../../../services/redux/modules/admin/selector";
import {
  deleteUserPublicToken,
  generateUserPublicToken,
} from "../../../services/redux/modules/admin/thunk";
import { useAppDispatch } from "../../../services/redux/tools";
import SettingLine from "../SettingLine";
import s from "./index.module.css";

export default function ManagePublicToken() {
  const dispatch = useAppDispatch();
  const accounts = useSelector(selectAccounts);
  const location = window.location.origin;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    username: string;
    token: string;
  } | null>(null);

  const generateToken = async (userId: string) => {
    await dispatch(generateUserPublicToken({ userId }));
  };

  const deleteToken = async (userId: string) => {
    await dispatch(deleteUserPublicToken({ userId }));
  };

  const openTokenDialog = (
    userId: string,
    username: string,
    token: string,
  ) => {
    setSelectedUser({ id: userId, username, token });
    setOpenDialog(true);
  };

  const onCopy = () => {
    dispatch(
      alertMessage({
        level: "info",
        message: "Public URL copied to clipboard",
      }),
    );
  };

  return (
    <TitleCard title="Manage user public tokens">
      <Dialog
        title={`Public token for ${selectedUser?.username || ""}`}
        onClose={() => setOpenDialog(false)}
        open={openDialog}>
        {selectedUser && (
          <>
            <Text element="div" className={s.disclaimer} size="normal">
              This public URL allows anyone with it to view{" "}
              {selectedUser.username}&apos;s stats indefinitely. The user
              won&apos;t be able to execute any action that modifies the
              account.
            </Text>
            <CopyToClipboard
              text={`${location}/?token=${selectedUser.token}`}
              onCopy={onCopy}>
              <div className={s.link}>
                <Text element="div" size="normal">
                  {`${location}/?token=${selectedUser.token}`}
                </Text>
              </div>
            </CopyToClipboard>
          </>
        )}
      </Dialog>
      <Text element="div" className={s.disclaimer} size="normal">
        Generate, view, or delete public tokens for users. A public token
        allows read-only access to a user&apos;s statistics.
      </Text>
      {accounts.map(user => {
        const { publicToken } = user;
        return (
          <SettingLine
            key={user.id}
            left={`${user.username}${publicToken ? " (has token)" : ""}`}
            right={
              <div className={s.row}>
                {publicToken ? (
                  <>
                    <Button
                      onClick={() =>
                        openTokenDialog(user.id, user.username, publicToken)
                      }>
                      Open
                    </Button>
                    <Button onClick={() => generateToken(user.id)}>
                      Regenerate
                    </Button>
                    <Button onClick={() => deleteToken(user.id)}>Delete</Button>
                  </>
                ) : (
                  <Button onClick={() => generateToken(user.id)}>
                    Generate
                  </Button>
                )}
              </div>
            }
          />
        );
      })}
    </TitleCard>
  );
}
