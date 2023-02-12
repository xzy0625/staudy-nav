function outer() {
  let a = 3;
  return function (value, print = false) {
    if (print) {
      console.log(a, '..aa');
      return;
    }
    // a.push(value);
    a = value;
    console.log(a, '...');
  };
}

const f1 = outer();
const f2 = outer();

f1(222);
f2(333, true);
