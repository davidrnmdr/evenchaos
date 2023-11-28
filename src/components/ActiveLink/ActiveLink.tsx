import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";

type ActiveLinkProps = LinkProps & {
  activeClassName: string;
  children: string | ReactElement;
};

export function ActiveLink({
  children,
  activeClassName,
  ...rest
}: ActiveLinkProps) {
  const { asPath } = useRouter();
  const className = asPath == rest.href ? activeClassName : "";

  return (
    <Link className={className} {...rest}>
      {children}
    </Link>
  );
}
