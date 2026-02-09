import React, { useState } from "react";
import { Drawer, Button } from "@mui/material";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { selectPublicToken, selectIsImpersonating, selectUser } from "../../services/redux/modules/user/selector";
import { stopImpersonating } from "../../services/redux/modules/user/thunk";
import { useAppDispatch } from "../../services/redux/tools";
import Text from "../Text";
import s from "./index.module.css";
import Sider from "./Sider";
import { LayoutContext } from "./LayoutContext";
import { useSider } from "./useSider";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState(false);
  const { siderAllowed, siderIsDrawer } = useSider();
  const dispatch = useAppDispatch();

  const publicToken = useSelector(selectPublicToken);
  const isImpersonating = useSelector(selectIsImpersonating);
  const user = useSelector(selectUser);

  const layoutContextValue = {
      openDrawer: () => setOpen(true),
      closeDrawer: () => setOpen(false),
    };

  const handleStopImpersonating = () => {
    dispatch(stopImpersonating());
  };

  return (
    <LayoutContext.Provider value={layoutContextValue}>
      <div className={s.root}>
        {siderAllowed && siderIsDrawer && (
          <Drawer open={open} anchor="left" onClose={() => setOpen(false)}>
            <Sider isDrawer />
          </Drawer>
        )}
        <section className={s.sider}>
          {siderAllowed && !siderIsDrawer && <Sider />}
        </section>
        <section
          className={clsx({
            [s.content]: true,
            [s.contentdrawer]: siderAllowed && !siderIsDrawer,
          })}>
          {publicToken && (
            <div className={s.publictoken}>
              <Text size="normal">You are viewing as guest</Text>
            </div>
          )}
          {isImpersonating && user && (
            <div className={s.impersonating}>
              <Text size="normal">
                You are impersonating {user.username}
              </Text>
              <Button 
                onClick={handleStopImpersonating}
                variant="outlined"
                size="small"
                sx={{ ml: 2 }}
              >
                Stop Impersonating
              </Button>
            </div>
          )}
          {children}
        </section>
      </div>
    </LayoutContext.Provider>
  );
}
