import { Tooltip } from "./Tooltip";
import { VariantRow, VariantsTable } from "@sln/storybook/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  title: "UI/Tooltip",
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  name: "Tooltip",
  parameters: {
    hoverMsg: "Click to copy",
    alertMsg: "Copied!",
    content: "Copy me!",
  },
  render: (_, { parameters: { content, hoverMsg, alertMsg } }) => (
    <VariantsTable titles={[]}>
      <VariantRow variant="Default">
        <Tooltip content={`${hoverMsg}`}>
          <span
            className="dark:text-darkgray-50 bg-brand-default dark:bg-darkgray-900 rounded-md p-2 text-gray-100 hover:cursor-pointer"
            onClick={() => {
              alert(`${alertMsg}`);
            }}
          >
            {content}
          </span>
        </Tooltip>
      </VariantRow>
    </VariantsTable>
  ),
};
