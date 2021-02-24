import React from "react";
import { shallow } from "enzyme";
import Skills from "./Skills";

describe("Skills", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Skills />);
    expect(wrapper).toMatchSnapshot();
  });
});
