import React from "react";
import { shallow } from "enzyme";
import Signup from "./Signup";

describe("Signup", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Signup />);
    expect(wrapper).toMatchSnapshot();
  });
});
