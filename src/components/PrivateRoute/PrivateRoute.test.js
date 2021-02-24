import React from "react";
import { shallow } from "enzyme";
import PrivateRoute from "./PrivateRoute";

describe("PrivateRoute", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<PrivateRoute />);
    expect(wrapper).toMatchSnapshot();
  });
});
