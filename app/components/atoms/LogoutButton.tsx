import type { Props } from "./Button";
import { TextButton } from "./Button";

export const LogoutButton = ({ children = "Logout", ...props }: Props) => (
  <form action="/logout" method="post">
    <TextButton
      type="submit"
      className="!bg-rose-600 dark:!bg-rose-400"
      {...props}
    >
      {children}
    </TextButton>
  </form>
);
