import { json, type LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { requireUser, type User } from "~/models/session.server"

type LoaderData = {
  user: User
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request)
  return json<LoaderData>({ user })
}

export const AdminAdmins = () => {
  const { user } = useLoaderData<LoaderData>() // <typeof loader>
  return <div>SUPER ADMIN ADMINS</div>
}

export default AdminAdmins
