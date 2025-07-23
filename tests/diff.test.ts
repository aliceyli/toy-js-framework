import { GetObjDiff } from "../src/diff";

describe("Diffing", () => {
  it("returns added, removed, changed", () => {
    const expected = {
      added: [],
      removed: [],
      changed: ["backgroundColor"],
    };
    const result = GetObjDiff(
      {
        backgroundColor: "#04AA6D",
      },
      {
        backgroundColor: "#04ABBB",
      }
    );

    expect(result).toEqual(expected);
  });

  it("returns added, removed, changed", () => {
    const expected = {
      added: [],
      removed: [],
      changed: ["backgroundColor"],
    };
    const result = GetObjDiff(
      {
        backgroundColor: "#04AA6D",
      },
      {
        backgroundColor: "#04ABBB",
      }
    );

    expect(result).toEqual(expected);
  });
});
