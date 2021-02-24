import React from "react";
import { shallow } from "enzyme";
import Appbar from "./Appbar";

describe("Appbar", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Appbar />);
    expect(wrapper).toMatchSnapshot();
  });
});
