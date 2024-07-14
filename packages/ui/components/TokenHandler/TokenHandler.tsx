import { useLocale } from "@sln/lib/hooks/useLocale";
import { Label, Input } from "@sln/ui";

type Digit = {
  value: number;
  onChange: () => void;
};
type PropType = {
  digits: Digit[];
  digitClassName: string;
};

const TokenHandler = ({ digits, digitClassName }: PropType) => {
  const { t } = useLocale();

  return (
    <div>
      <Label htmlFor="code">{t("code")}</Label>
      <div className="flex flex-row justify-between">
        {digits.map((element, index) => (
          <Input
            key={index}
            className={digitClassName}
            name={`2fa${index + 1}`}
            inputMode="decimal"
            {...element}
            autoFocus={index === 0}
            autoComplete="one-time-code"
          />
        ))}
      </div>
    </div>
  );
};

export default TokenHandler;
