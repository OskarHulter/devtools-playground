import classNames from "clsx/lite";

import type { VerticalTabItemProps } from "./VerticalTabItem";
import VerticalTabItem from "./VerticalTabItem";

export { VerticalTabItem };

export interface NavTabProps {
  tabs: VerticalTabItemProps[];
  children?: React.ReactNode;
  className?: string;
  sticky?: boolean;
  linkShallow?: boolean;
  linkScroll?: boolean;
  itemClassname?: string;
  iconClassName?: string;
}

const NavTabs = ({
  tabs,
  className = "",
  sticky,
  linkShallow,
  linkScroll,
  itemClassname,
  iconClassName,
  ...props
}: NavTabProps) => (
  <nav
    className={classNames(
      `no-scrollbar flex flex-col space-y-0.5 overflow-scroll ${className}`,
      sticky && "sticky top-0 -mt-7"
    )}
    aria-label="Tabs"
    {...props}
  >
    {/* padding top for sticky */}
    {sticky && <div className="pt-6" />}
    {props.children}
    {tabs.map((tab, idx) => (
      <VerticalTabItem
        {...tab}
        key={idx}
        linkShallow={linkShallow}
        linkScroll={linkScroll}
        className={itemClassname}
        iconClassName={iconClassName}
      />
    ))}
  </nav>
);

export default NavTabs;
