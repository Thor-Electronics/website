import {
  EllipsisVerticalIcon,
  PaperAirplaneIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { json, type LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import axios from "axios";
import type { ReactNode } from "react";
import { useState } from "react";
import { requireSessionToken, requireUser } from "~/models/session.server";
import type { Device } from "~/types/Device";
import { type User } from "~/types/User";
import api from "~/utils/core.server";
import { timeAgo } from "~/utils/time";

type LoaderData = {
  user: User;
  token: string;
  devices: Device[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  const token = await requireSessionToken(request);
  const devices = await api.adminGetDevices(token);
  return json<LoaderData>({ user, token, devices });
};

export const ManageDevices = () => {
  const { user, token, devices } = useLoaderData<LoaderData>();
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>("");
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [messageOpen, setMessageOpen] = useState<boolean>(false);
  const [messageId, setMessageId] = useState<string>("");

  const openEditDialog = (dId: string) => {
    setEditOpen(true);
    setEditId(dId);
    // Set edit state so that the dialog knows what to load ...
  };
  const openDeleteDialog = (dId: string) => {
    setDeleteOpen(true);
    setDeleteId(dId);
    // Set delete state so that the dialog knows what to load?
  };
  const openMessageDialog = (dId: string) => {
    setMessageOpen(true);
    setMessageId(dId);
  };
  const closeEditDialog = () => setEditOpen(false);
  const closeDeleteDialog = () => setDeleteOpen(false);
  const closeMessageDialog = () => setMessageOpen(false);

  const deleteDevice = () => {
    console.log("Device was deleted through API!");
    axios
      .delete(`${ENV.CORE_URL}/api/v1/devices/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Device was deleted");
        alert(`Device(${deleteId}) was deleted successfully`);
        closeDeleteDialog();
        window.location.reload();
      });
  };

  const sendMessageToDevice = () => {
    console.log("SENDING...");
  };

  // todo: find a better way check by their permission
  const isUserAllowedToMutate = !!user.roles; // todo: remove options from rows if user's not allowed
  const deviceOptions = {
    edit: true, // todo: based on permissions and access
    onEdit: openEditDialog,
    onEditClose: closeEditDialog,
    delete: true, // todo: based on permissions and access
    onDelete: openDeleteDialog,
    onDeleteClose: closeDeleteDialog,
    message: true, // todo: based on permissions and access
    onMessage: openMessageDialog,
    onMessageClose: closeMessageDialog,
  };

  return (
    <div className="ManageDevices admin-page">
      <h2 className="page-title">Device Management</h2>
      <div className="data-container">
        <DataGrid
          rows={devices}
          columns={generateGridColumns(deviceOptions)}
          autoHeight
          // checkboxSelection={isUserAllowedToMutate}
          // isRowSelectable={() => true}
        />
      </div>

      {/* Edit Device Dialog */}
      <Dialog
        open={editOpen}
        onClose={closeEditDialog}
        aria-labelledby="edit-dialog-title"
        aria-describedby="edit-dialog-description"
      >
        <DialogTitle id="edit-dialog-title">
          Edit "Device Name" as {user.roles![0].name}
        </DialogTitle>
        <DialogContent id="edit-dialog-description">
          You'll be redirected to another page!
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Link to={`/devices/${editId}/edit`} prefetch="render">
            <Button autoFocus variant="contained" color="primary">
              Edit
            </Button>
          </Link>
        </DialogActions>
      </Dialog>

      {/* Delete Device Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete "Device Name" as {user.roles![0].name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Deleting this device will cause it{" "}
            <b>being disconnected form Thor IoT Network</b>, which means it
            needs to re-signup in in order to use the services. Are you sure you
            want to delete this device? (The page will reload after the device
            is deleted successfully)
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button
            onClick={deleteDevice}
            autoFocus
            variant="contained"
            color="error"
          >
            DELETE
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Message to Device Dialog */}
      <Dialog
        open={messageOpen}
        onClose={closeMessageDialog}
        aria-labelledby="message-dialog-title"
        aria-describedby="message-dialog-description"
      >
        <Form method="POST">
          <DialogTitle id="message-dialog-title">
            Send Message to "Device Name" as {user.roles![0].name}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="message-dialog-description">
              This is a debug tool which allows us to send custom messages to
              devices for debugging and troubleshooting purposes.
            </DialogContentText>
            <textarea
              className="w-full font-mono text-xs bg-slate-800
                text-emerald-300 rounded-md p-2 mt-4"
              name="message"
              rows={15}
            >
              {JSON.stringify(
                {
                  ok: true,
                  signal: "UPDATE_STATE",
                  payload: {
                    ssid: "Thor Access Point",
                  },
                  control: {
                    power: {
                      "0": false,
                      "1": true,
                    },
                  },
                  update: {},
                  id: "000000000000000000000000",
                },
                null,
                2
              )}
            </textarea>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeMessageDialog}>Cancel</Button>
            <Button
              onClick={sendMessageToDevice}
              autoFocus
              variant="contained"
              color="primary"
              type="submit"
            >
              SEND
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    </div>
  );
};

const generateGridColumns = (options: {
  // todo: create a type for it!
  edit: boolean;
  onEdit: (dId: string) => any;
  onEditClose: () => any;
  delete: boolean;
  onDelete: (dId: string) => any;
  onDeleteClose: () => any;
  message: boolean;
  onMessage: (dId: string) => any;
  onMessageClose: () => any;
}): GridColDef[] => [
  {
    field: "action",
    headerName: "",
    width: 60,
    renderCell: ({ row }) => {
      const dId = row.id;
      return (
        <OptionsMenu
          options={[
            {
              title: "Edit",
              icon: <PencilIcon className="h-4 w-4" />,
              onClick: () => {
                console.log("Editing: ", dId);
                options.onEdit(dId);
              },
            },
            {
              title: "Delete",
              icon: <TrashIcon className="h-4 w-4" />,
              // className: "!text-rose-500",
              onClick: () => {
                console.log("Deleting: ", dId);
                options.onDelete(dId);
              },
            },
            {
              title: "Send Message",
              icon: <PaperAirplaneIcon className="h-4 w-4" />,
              // className: "!text-rose-500",
              onClick: () => {
                console.log("Preparing to send message to: ", dId);
                options.onMessage(dId);
              },
            },
          ]}
        />
      );
    },
  },
  {
    field: "id",
    headerName: "ID",
    width: 200,
    cellClassName: "text-xs font-mono",
  },
  {
    field: "cpuId",
    headerName: "CPU ID",
    width: 100,
    cellClassName: "text-xs font-mono font-semibold",
  },
  { field: "type", headerName: "Type", width: 150 }, // todo: render icon instead!
  { field: "name", headerName: "Name", width: 200 },
  {
    field: "created_at",
    headerName: "Creation Date",
    width: 125,
    valueGetter: (params) => timeAgo(new Date(params.value)),
  },
  {
    field: "updated_at",
    headerName: "Last Update",
    width: 125,
    // headerAlign: "center",
    // align: "center",
    valueGetter: (params) => timeAgo(new Date(params.value)),
  },
];

type DeviceOptionsMenuProps = {
  options: {
    title: string;
    icon?: ReactNode;
    className?: string;
    onClick: Function;
  }[];
};

export const OptionsMenu = ({ options }: DeviceOptionsMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <EllipsisVerticalIcon className="h-6 w-6" />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {options.map((o) => (
          <MenuItem
            key={o.title}
            onClick={() => {
              o.onClick();
              handleClose();
            }}
            className={o.className}
          >
            {o.icon && <ListItemIcon>{o.icon}</ListItemIcon>}
            <ListItemText>{o.title}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ManageDevices;
