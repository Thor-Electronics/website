import type {
  ErrorBoundaryComponent,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  V2_MetaFunction,
} from "@remix-run/node"
import { Response } from "@remix-run/node"
import { json } from "@remix-run/node"
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react"
// import NavigatingScreen from "./components/NavigatingScreen"
import styles from "~/styles/root.css"
import { LogoIcon } from "./components/atoms/LogoIcon"
import { getEnv } from "./env.server"
import type { V2_ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules"

// TODO: MetaFunction after upgrade to v2
export const meta: V2_MetaFunction = () => [
  { title: "Thor Electronics" },
  { charSet: "utf-8" },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
  { name: "theme-color", content: "#3b82f6" },
]

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }]

function Document({
  children,
  title = `Thor Electronics`,
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        {/* <NavigatingScreen /> */}
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

type LoaderData = {
  ENV: ReturnType<typeof getEnv>
}

export const loader: LoaderFunction = () =>
  json<LoaderData>({
    ENV: getEnv(),
  })

export default function App() {
  const { ENV } = useLoaderData<LoaderData>()
  return (
    <Document>
      <Outlet />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(ENV)}`,
        }}
      />
    </Document>
  )
}

export const ErrorBoundary: V2_ErrorBoundaryComponent = () => {
  const error = useRouteError()
  console.error("ERROR: ", error)

  if (isRouteErrorResponse(error)) {
    console.log("Is Route Error Response: ", error)
    return (
      <Document title="Oops!">
        <div className="error-container h-screen error bg-rose-100 text-rose-600 flex flex-col gap-6 items-center justify-center text-center">
          <LogoIcon className="w-32" />
          <h2 className="text-2xl font-bold">Something Went Wrong!</h2>
          <p className="font-lg font-semibold">
            {error.status} | {error.statusText}
          </p>
          <p className="text-sm">
            There was an error loading this page!{" "}
            {error.data?.message ?? error.data}
          </p>
        </div>
      </Document>
    )
  }

  let errMsg = "Unknown Error"
  // TODO: detect error type check
  // if (error && error.message && error.message !== undefined) {
  //   errMsg = error.message
  // }
  return (
    <Document title="Error!">
      <div className="error-container h-screen bg-rose-200 text-rose-600 flex flex-col gap-6 items-center justify-center text-center">
        <LogoIcon className="w-32" />
        <h1 className="status flex items-center justify-center gap-2 text-3xl font-bold">
          App Error
        </h1>
        <div className="error text-xl font-bold">{errMsg}</div>
        {/* <pre>{error.message}</pre> */}
        <Link to="/" className="font-semibold !underline" prefetch="render">
          Back to home
        </Link>
      </div>
    </Document>
  )
}
