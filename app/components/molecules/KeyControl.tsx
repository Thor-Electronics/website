import type { FC } from "react";
import type { DeviceControlProps, DeviceState } from "~/types/Device";
import { DeviceType } from "~/types/DeviceType";
import { Switch } from "../atoms/Switch";
// import { Switch } from "@mui/material";

export const Key4: FC<DeviceControlProps<DeviceState>> = ({
  type: t,
  state,
  updateHandler,
}: DeviceControlProps<DeviceState>) => {
  const handleUpdate = (k: string, v: number | boolean) => {
    if (!handleUpdate)
      return console.warn("Update handler is not configured for this key!");
    if (!state.power) {
      state.power = {
        "0": false,
        "1": false,
        "2": false,
        "3": false,
      };
    }
    updateHandler({
      command: {
        power: {
          ...(state.power as object),
          [k]: v ? false : true,
        },
      },
    });
  };
  const toggleSinglePower = () => {
    if (!updateHandler) return;
    updateHandler({
      command: { power: state.power ? false : true },
    });
  };

  // Fix state if empty
  if (!state || typeof state !== "object") state = {};
  if (t !== DeviceType.Key && t !== DeviceType.Key1) {
    if (!state.power || typeof state.power !== "object") {
      state.power =
        t === DeviceType.Key2
          ? { 0: false, 1: false }
          : t === DeviceType.Key3
          ? { 0: false, 1: false, 2: false }
          : { 0: false, 1: false, 2: false, 3: false }; // it's probably 4
    }
  }

  return (
    <div
      className={`KeyControl flex flex-row items-center justify-center
      gap-2 flex-wrap h-full`}
    >
      {t === DeviceType.Key || t === DeviceType.Key1 ? (
        <Switch checked={!!state.power} onChange={toggleSinglePower} />
      ) : (
        Object.entries(state.power as object).map(([k, v]) => {
          return (
            <label
              key={k}
              className={`flex items-center justify-center flex-row gap-2 ${
                Object.entries(state.power as object).length === 3
                  ? ""
                  : "my-1 mx-4"
              }`}
            >
              {k}
              {/* <Switch checked={!!v} onChange={() => handleUpdate(k, v)} /> */}
              <Switch checked={!!v} onChange={() => handleUpdate(k, v)} />
            </label>
          );
        })
      )}
    </div>
  );
};

export default Key4;
