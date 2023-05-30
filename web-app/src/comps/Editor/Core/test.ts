import { parseListText } from "./List";

let assertCount = 1;

function assert(bool: boolean, desc?: string) {
  desc = desc || "Assertion " + assertCount;
  if (bool) {
    console.log(`Passed - ${desc}`);
  } else {
    console.error(`Failed - ${desc}`);
  }
  assertCount += 1;
}

export function test() {
  assert(parseListText("Non list") === undefined);
  assert(parseListText("- Item")?.level === 0);
  assert(parseListText("    - Item")?.level === 1);
  assert(parseListText("   - Item")?.level === 0);
  assert(parseListText("        - Item")?.level === 2);
  assert(parseListText("            - Item")?.level === 3);

  assert(parseListText("- Item")?.type === "unordered");
  assert(parseListText("1. Item")?.type === "ordered");

  assert(parseListText("1. Item")?.serial === 1);
  assert(parseListText("2. Item")?.serial === 2);
  assert(parseListText("20. Item")?.serial === 20);
  assert(parseListText("209392. Item")?.serial === 209392);

  assert(parseListText("- Item")?.content === "Item");
  assert(parseListText("-  Item")?.content === " Item");
  assert(parseListText("-  Item some more ")?.content === " Item some more ");
  assert(parseListText("-  Item __b__ 9392 !@#$%^&*()_+-={}| ")?.content === " Item __b__ 9392 !@#$%^&*()_+-={}| ");

  assert(parseListText("- Item")?.symbol === "-");
  assert(parseListText("+ Item")?.symbol === "+");
  assert(parseListText("* Item")?.symbol === "*");
}
