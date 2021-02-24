import React from "react";
import { shallow } from "enzyme";
import Volunteer from "./Volunteer";

describe("Volunteer", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Volunteer />);
    expect(wrapper).toMatchSnapshot();
  });
});
