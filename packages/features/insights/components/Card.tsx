import { classNames } from "@sln/lib";
import { Card } from "@tremor/react";

interface ICardProps {
  children: React.ReactNode;
  className?: string;
}

export const CardInsights = (props: ICardProps) => {
  const { children, className = "", ...rest } = props;

  return (
    <Card
      className={classNames(`ring-subtle bg-muted shadow-none `, className)}
      {...rest}
    >
      {children}
    </Card>
  );
};
