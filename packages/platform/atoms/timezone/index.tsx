import type { TimezoneSelectProps } from "@sln/ui";
import { TimezoneSelectComponent } from "@sln/ui";

import useGetCityTimezones from "../hooks/useGetCityTimezones";

export function Timezone(props: TimezoneSelectProps) {
  const { isLoading, data } = useGetCityTimezones();

  return (
    <TimezoneSelectComponent
      {...props}
      data={data?.data}
      isPending={isLoading}
    />
  );
}
