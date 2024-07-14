import useAddAppMutation from "../../_utils/useAddAppMutation";
import { AppOnboardingSteps } from "@sln/lib/apps/appOnboardingSteps";
import { getAppOnboardingUrl } from "@sln/lib/apps/getAppOnboardingUrl";
import { WEBAPP_URL } from "@sln/lib/constants";
import type { DialogProps } from "@sln/ui";
import { Button } from "@sln/ui";
import { Dialog, DialogClose, DialogContent, DialogFooter } from "@sln/ui";

export function AccountDialog(props: DialogProps) {
  const mutation = useAddAppMutation(null);
  return (
    <Dialog
      name="Account check"
      open={props.open}
      onOpenChange={props.onOpenChange}
    >
      <DialogContent
        type="creation"
        title="Connecting with MS Teams requires a work/school Microsoft account."
        description="If you continue with a personal account you will receive an error"
      >
        <DialogFooter showDivider className="mt-6">
          <>
            <DialogClose
              type="button"
              color="secondary"
              tabIndex={-1}
              onClick={() => {
                props.onOpenChange?.(false);
              }}
            >
              Cancel
            </DialogClose>

            <Button
              type="button"
              onClick={() =>
                mutation.mutate({
                  type: "office365_video",
                  variant: "conferencing",
                  slug: "msteams",
                  returnTo:
                    WEBAPP_URL +
                    getAppOnboardingUrl({
                      slug: "msteams",
                      step: AppOnboardingSteps.EVENT_TYPES_STEP,
                    }),
                })
              }
            >
              Continue
            </Button>
          </>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AccountDialog;
