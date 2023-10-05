function isGreaterThan(x: any, y: any) {
  return x > y;
}
function isLessThan(x: any, y: any) {
  return x < y;
}

function greaterThanOrEqualTo(x: any, y: any) {
  return x >= y;
}
function lessThanOrEqualTo(x: any, y: any) {
  return x <= y;
}
function equalTo(x: any, y: any) {
  return x == y;
}
function notEqualTo(x: any, y: any) {
  return x != y;
}

export {
  isGreaterThan,
  isLessThan,
  greaterThanOrEqualTo,
  lessThanOrEqualTo,
  equalTo,
  notEqualTo,
};
