import SelectGifInput from "./SelectGifInput";
import type { EventTypeAppSettingsComponent } from "@sln/app-store/types";

const EventTypeAppSettingsInterface: EventTypeAppSettingsComponent = ({
  getAppData,
  setAppData,
  disabled,
}) => {
  const thankYouPage = getAppData("thankYouPage");

  return (
    <SelectGifInput
      defaultValue={thankYouPage}
      disabled={disabled}
      onChange={(url: string) => {
        setAppData("thankYouPage", url);
      }}
    />
  );
};

export default EventTypeAppSettingsInterface;
