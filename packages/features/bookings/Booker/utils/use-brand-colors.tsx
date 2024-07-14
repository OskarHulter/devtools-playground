import useGetBrandingColours from "@sln/lib/getBrandColours";
import useTheme from "@sln/lib/hooks/useTheme";
import { useCalcomTheme } from "@sln/ui";

export const useBrandColors = ({
  brandColor,
  darkBrandColor,
  theme,
}: {
  brandColor?: string;
  darkBrandColor?: string;
  theme?: string | null;
}) => {
  const brandTheme = useGetBrandingColours({
    lightVal: brandColor,
    darkVal: darkBrandColor,
  });

  useCalcomTheme(brandTheme);
  useTheme(theme);
};
