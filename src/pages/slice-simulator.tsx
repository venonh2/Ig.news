import { SliceSimulator } from "@prismicio/slice-simulator-react";
import { SliceZone } from "@prismicio/react";

import { BlogPosts } from "../../slices/index";
import state from "../../.slicemachine/libraries-state.json";

const SliceSimulatorPage = () => {
  return (
    <SliceSimulator
      sliceZone={({ slices }) => (
        <SliceZone key={23324} slices={slices} components={BlogPosts} />
      )}
      state={state}
    />
  );
};

export default SliceSimulatorPage;
