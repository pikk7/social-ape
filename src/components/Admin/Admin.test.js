import React from "react";
import { shallow } from "enzyme";
import Admin from "./Admin";

describe("Admin", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Admin />);
    expect(wrapper).toMatchSnapshot();
  });
});
