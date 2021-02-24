import React from "react";
import { shallow } from "enzyme";
import Login from "./Login";

describe("Login", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Login />);
    expect(wrapper).toMatchSnapshot();
  });
});
