import { render } from "@testing-library/react";
import React from "react";
import About from "../../../components/About/About";

it("should render", () => {
  const { getByText } = render(<About />);
  expect(
    getByText(/About/i)
  ).toBeInTheDocument();
});