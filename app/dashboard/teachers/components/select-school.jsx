import { AutoComplete, Option } from "@/components/autocomplete-select";
import { useState } from "react";



export function AutocompleteSchools({ schools }) {
  const [isLoading, setLoading] = useState(false);
  const [isDisabled, setDisbled] = useState(false);
  const [value, setValue] = useState();

  return (
    <div className="not-prose flex flex-col gap-4">
      <AutoComplete
        options={schools}
        emptyMessage="No school found"
        placeholder="Search for a school"
        isLoading={isLoading}
        onValueChange={setValue}
        value={value}
        disabled={isDisabled}
      />
    </div>
  );
}
