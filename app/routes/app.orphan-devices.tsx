import type { Group } from "~/types/Group"
import { DASHBOARD_PREFIX, useAppLoaderData } from "./app"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { getSessionToken } from "~/models/session.server"
import api, { getUserGroups } from "~/utils/core.server"
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react"
import { TextButton } from "~/components/atoms/Button"
import invariant from "tiny-invariant"
import { Alert } from "@mui/material"

type LoaderData = {
  token: string
  groups: Group[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const token = await getSessionToken(request)
  const groups = await getUserGroups(token)
  return json<LoaderData>({ token, groups })
}

type ActionData = {
  error?: string
}

export const action: ActionFunction = async ({ request }) => {
  const token = await getSessionToken(request)
  const formData = await request.formData()
  const deviceId = formData.get("deviceId") as string
  const groupId = formData.get("groupId") as string
  invariant(deviceId, "Device ID is required")
  invariant(groupId, "Group ID is required")
  return api
    .updateDevice(deviceId, token, { groupId })
    .then(data => {
      console.log("DATA: ", data)
      return json<ActionData>({})
    })
    .catch(err => {
      console.error(
        "Error moving device to group: ",
        err,
        err.response?.data?.message,
        err.response?.data
      )
      return json<ActionData>({
        error: "Failed to move device to group: " + err.response?.data?.message,
      })
    })
}

export default function AppOrphanDevicesRoute() {
  const { orphanDevices, token } = useAppLoaderData()
  const { groups } = useLoaderData<LoaderData>()
  const actionData = useActionData<ActionData>()

  return (
    <div className="card flex flex-col items-stretch gap-4 !rounded-xl">
      {actionData?.error && <Alert severity="error">{actionData.error}</Alert>}
      {orphanDevices.map(d => (
        <div className="bg-slate-200 p-2 shadow-inner rounded-md" key={d.id}>
          <b className="title">{d.name}</b> -{" "}
          <small className="text-xs text-slate-500 font-mono">{d.id}</small>
          <Form method="POST">
            <label className="block mt-4">
              Move to:
              <select name="groupId" required>
                <option key={0}>Please Select</option>
                {groups.map(g => (
                  <option value={g.id} key={g.id}>
                    {g.name}
                    {/* ({g.type ?? "Building"}) */}
                  </option>
                ))}
              </select>
            </label>
            <input type="text" value={d.id} name="deviceId" readOnly hidden />
            <div className="buttons mt-4 flex items-start gap-2 justify-start flex-row-reverse">
              <TextButton className="!bg-primary" type="submit">
                Move
              </TextButton>
              <Link to={`${DASHBOARD_PREFIX}/devices/${d.id}/transfer`}>
                <TextButton className="!bg-teal-500">Transfer</TextButton>
              </Link>
              <Link
                to={`${DASHBOARD_PREFIX}/devices/${d.id}/remove?intent=delete`}
              >
                <TextButton className="!bg-rose-500">Delete</TextButton>
              </Link>
            </div>
          </Form>
        </div>
      ))}
    </div>
  )
}